from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from main import db
from models import User, TokenBlocklist
from datetime import datetime, timezone

user_bp = Blueprint('user_bp', __name__)

# --------------- Get Current User Info ------------------
@user_bp.route('/user/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Returns the currently authenticated user's details"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "email": user.email,
        "is_admin": user.is_admin
    }), 200

# --------------- Sign Up as a User --------------------
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "Email already registered"}), 400

    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        is_admin=False
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# --------------- Login as a User/Admin ------------------
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_access_token(identity=user.id, fresh=False)
    return jsonify({"access_token": access_token, "refresh_token": refresh_token, "is_admin": user.is_admin}), 200

# --------------- Get User Profile ------------------
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    user_data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_admin": user.is_admin
    }

    return jsonify(user_data), 200

# --------------- Update User Profile ------------------
@user_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json

    if "first_name" in data and data["first_name"]:
        user.first_name = data["first_name"]

    if "last_name" in data and data["last_name"]:
        user.last_name = data["last_name"]

    if "email" in data and data["email"]:
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user and existing_user.id != current_user_id:
            return jsonify({"message": "Email is already in use"}), 400
        user.email = data["email"]

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200

# --------------- Change Password ------------------ 
@user_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not check_password_hash(current_user.password, current_password):
        return jsonify({"message": "Current password is incorrect"}), 400

    if not new_password:
        return jsonify({"message": "New password is required"}), 400

    hashed_new_password = generate_password_hash(new_password)

    current_user.password = hashed_new_password
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

# --------------- Create an Admin ------------------
@user_bp.route('/admin/create', methods=['POST'])
@jwt_required()
def create_admin():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or not current_user.is_admin:
        return jsonify({"message": "Unauthorized. Only admins can create new admins."}), 403

    data = request.json
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    new_admin = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        is_admin=True
    )
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": "Admin user created successfully"}), 201

# --------------- Logout ------------------
@user_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "Logged out successfully"}), 200

# --------------- Refresh Token ------------------
@user_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    
    return jsonify({"access_token": new_access_token}), 200
