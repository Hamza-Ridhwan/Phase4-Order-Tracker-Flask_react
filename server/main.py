from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import TokenBlocklist
from datetime import timedelta
from extensions import db, jwt

app = Flask(__name__)
CORS(app)



app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://ordertrackerdb_ju8c_user:pSZcU6wjKjGAO1G7OL96YY944ayZquIz@dpg-cuiv77dumphs73bjh4vg-a.oregon-postgres.render.com/ordertrackerdb_ju8c'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate = Migrate(app, db)
db.init_app(app)


# Flask mail configuration
app.config["MAIL_SERVER"]= 'smtp.gmail.com'
app.config["MAIL_PORT"]=587
app.config["MAIL_USE_TLS"]=True
app.config["MAIL_USE_SSL"]=False
app.config["MAIL_USERNAME"]="hamzathehamzah@gmail.com"
app.config["MAIL_PASSWORD"]="wfcx bdpu soxl ijf"
app.config["MAIL_DEFAULT_SENDER"]="hamzathehamzah@gmail.com"
mail = Mail(app)


# Flask-JWT-Extended configuration
app.config["JWT_SECRET_KEY"] = "jkjhsjkdhkjhas uyOISUDIU" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt.init_app(app)


# Register Blueprints
from views import user_bp, order_bp, shipment_bp
app.register_blueprint(user_bp)
app.register_blueprint(order_bp)
app.register_blueprint(shipment_bp)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

