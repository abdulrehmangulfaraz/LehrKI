# backend/app/db/create_tables.py

# When you run this file as a module, these imports will now work correctly
from .database import Base, engine
from .models import User # Assuming your User model is in models.py

print("Creating tables...")

# This will now use the correctly configured engine from database.py
Base.metadata.create_all(bind=engine)

print("Tables created successfully.")