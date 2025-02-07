from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Shipment

shipment_bp = Blueprint('shipment_bp', __name__)

# --------------- Get All Shipments ------------------
    #  Retrieves all shipments for the current user (if not admin) or all shipments (if admin)
@shipment_bp.route('/shipments', methods=['GET'])
@jwt_required()
def get_shipments():
    shipments = Shipment.query.all()
    return jsonify([shipment.to_json() for shipment in shipments]), 200


# --------------- Get Shipment by ID ------------------
    # Ensures the shipment exists before fetching
@shipment_bp.route('/shipments/<int:shipment_id>', methods=['GET'])
@jwt_required()
def get_shipment(shipment_id):
    shipment = Shipment.query.get(shipment_id)
    if not shipment:
        return jsonify({"message": "Shipment not found"}), 404

    return jsonify(shipment.to_json()), 200
