from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from main import db
from models import Order, Shipment, User
from sqlalchemy.sql import func
import random
import string

order_bp = Blueprint('order_bp', __name__)

# Generate a unique tracking number
def generate_tracking_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

# --------------- Create an order ------------------
    #  Creates a new order with a unique tracking number
    #  Sets the status to 'pending'
@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    data = request.json

    new_order = Order(
        user_id=current_user_id,
        product=data['product'],
        quantity=data.get('quantity', 1),
        status='pending'
    )
    db.session.add(new_order)
    db.session.commit()

    return jsonify(new_order.to_json()), 201

# --------------- Get All Orders ------------------
    #  Retrieves all orders for the current user (if not admin) or all orders (if admin)
@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.is_admin:
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=current_user_id).all()

    return jsonify([order.to_json() for order in orders]), 200

# --------------- Get Order by ID ------------------        
@order_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404

    return jsonify(order.to_json()), 200


# --------------- Update Order ------------------ 
# Automatically creates a shipment when the order is shipped
# Prevents duplicate shipments
@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only allow admins to update the order status
    new_status = request.json.get('status', None)
    if new_status:
        new_status = new_status.lower()  # Convert to lowercase to prevent mismatch
        if new_status not in ['pending', 'shipped', 'delivered']:
            return jsonify({"message": "Invalid status value"}), 400

        if not current_user.is_admin:
            return jsonify({"message": "Only admins can update the order status"}), 403

    # Update fields that are allowed for the user to update
    order.product = request.json.get('product', order.product)
    order.quantity = request.json.get('quantity', order.quantity)

    # If the status is "shipped" and hasn't been shipped yet, create a shipment
    if new_status == 'shipped' and order.status != 'shipped':
        existing_shipment = Shipment.query.filter_by(order_id=order.id).first()
        if existing_shipment:
            return jsonify({"message": "Shipment already exists for this order"}), 400

        new_shipment = Shipment(
            order_id=order.id,
            tracking_number=generate_tracking_number(),
            shipped_date=func.now(),
            delivery_date=func.now()
        )
        db.session.add(new_shipment)

    # Update the status if it was provided and the user is an admin
    if new_status and current_user.is_admin:
        order.status = new_status

    db.session.commit()

    return jsonify(order.to_json()), 200

# --------------- Rate Order ------------------
    #  Allows the user to rate their order once it has been delivered
    #  Only the user who placed the order can rate it
@order_bp.route('/orders/<int:order_id>/rate', methods=['PUT'])
@jwt_required()
def rate_order(order_id):
    # Get the current logged-in user
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Retrieve the order by ID
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({"message": "Order not found"}), 404

    # Check if the order belongs to the logged-in user
    if order.user_id != current_user.id:
        return jsonify({"message": "You can only rate your own orders"}), 403

    # Check if the order has been delivered
    if order.status != 'delivered':
        return jsonify({"message": "You can only rate an order once it is delivered"}), 400

    # Get the rating from the request
    rating = request.json.get('rating')

    # Validate the rating (should be an integer between 1 and 5)
    if not rating or rating < 1 or rating > 5:
        return jsonify({"message": "Rating must be between 1 and 5"}), 400

    # Set the rating for the order
    order.rating = rating
    db.session.commit()

    return jsonify({"message": "Order rated successfully", "rating": rating}), 200




# --------------- Delete Order ------------------
    #  Deletes the shipment if it exists before deleting the order
@order_bp.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404

    existing_shipment = Shipment.query.filter_by(order_id=order.id).first()
    if existing_shipment:
        db.session.delete(existing_shipment)

    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order deleted successfully"}), 200
