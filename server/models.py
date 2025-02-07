from extensions import db
from sqlalchemy.sql import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    orders = db.relationship('Order', backref='user', lazy=True)

    def get_id(self):
        return str(self.id)

    def to_json(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email
        }
    
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum('pending', 'shipped', 'delivered', name='order_status'), default='pending', nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    rating = db.Column(db.Integer, nullable=True)

    shipment = db.relationship('Shipment', backref='order', uselist=False)

    def to_json(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'product': self.product,
            'quantity': self.quantity,
            'rating': self.rating,
            'status': self.status
        }
    
class Shipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'),unique=True, nullable=False)
    tracking_number = db.Column(db.String(255), unique=True, nullable=False)
    shipped_date = db.Column(db.DateTime, default=func.now())
    delivery_date = db.Column(db.DateTime, nullable=True)

    def to_json(self):
        return {
            'id': self.id,
            'orderId': self.order_id,
            'trackingNumber': self.tracking_number,
            'shippedDate': self.shipped_date,
            'deliveryDate': self.delivery_date
        }
    

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)