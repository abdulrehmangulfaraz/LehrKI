# backend/app/core/config.py
import os
from dotenv import load_dotenv
from pathlib import Path

# This builds an absolute path to your project's root directory
# and looks for the .env file there.
# Path(__file__) is this config file's location.
# .resolve().parents[3] goes up 3 directories (core -> app -> backend -> project root)
env_path = Path(__file__).resolve().parents[3] / '.env'

# First, check if the .env file actually exists where we expect it
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    # If it doesn't exist, we stop with a very clear error message.
    raise FileNotFoundError(f"ERROR: Could not find the .env file. Please ensure it is in the main project folder: {env_path.parent}")

# Now, we load the variables
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# This next part checks which specific variables are missing to help debug
missing_vars = []
if not DB_HOST: missing_vars.append("DB_HOST")
if not DB_PORT: missing_vars.append("DB_PORT")
if not DB_NAME: missing_vars.append("DB_NAME")
if not DB_USER: missing_vars.append("DB_USER")
if not DB_PASSWORD: missing_vars.append("DB_PASSWORD")

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("ERROR: SECRET_KEY is not set in the .env file")

if missing_vars:
    # If any variable is missing from the .env file, we list them.
    raise ValueError(f"ERROR: The following variables are missing from your .env file: {', '.join(missing_vars)}")

# If all checks pass, we create the database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"