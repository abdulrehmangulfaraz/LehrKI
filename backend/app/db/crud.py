# backend/app/db/crud.py

from sqlalchemy.orm import Session
from . import models
from .. import schemas
from ..core.auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    """Fetch a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_prompts_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Fetch all prompts owned by a specific user."""
    return db.query(models.Prompt).filter(models.Prompt.owner_id == user_id).offset(skip).limit(limit).all()

def create_user_prompt(db: Session, prompt: schemas.PromptCreate, user_id: int):
    """Create a new prompt for a user."""
    db_prompt = models.Prompt(**prompt.model_dump(), owner_id=user_id)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

# Add this new function at the end of crud.py

def get_all_prompts(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all prompts from all users for the public collection."""
    return db.query(models.Prompt).order_by(models.Prompt.id.desc()).offset(skip).limit(limit).all()