from main import app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash

# Create app context for accessing the database
with app.app_context():
    # Check if an admin already exists
    admin_email = "admin@example.com"
    existing_admin = User.query.filter_by(email=admin_email).first()

    if existing_admin:
        # Delete the existing admin user
        db.session.delete(existing_admin)
        db.session.commit()
        print("Existing admin user deleted.")

    # Create a new admin user with a hashed password
    admin_user = User(
        first_name="Admin",
        last_name="User",
        email=admin_email,
        password=generate_password_hash("admin_password"),  # Hash the password
        is_admin=True
    )
    db.session.add(admin_user)
    db.session.commit()
    print("New admin user created.")
