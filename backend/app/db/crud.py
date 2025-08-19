# backend/app/db/crud.py

from getpass import getuser
from sqlalchemy.orm import Session, joinedload # Import joinedload
from . import models
from .. import schemas
from ..core.auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    """Fetch a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name, role=user.role)
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

def get_all_prompts(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all prompts from all users for the public collection."""
    # Eager load the owner information to avoid lazy loading issues
    return db.query(models.Prompt).options(joinedload(models.Prompt.owner)).order_by(models.Prompt.id.desc()).offset(skip).limit(limit).all()

def get_prompt(db: Session, prompt_id: int):
    """Fetch a single prompt by its ID."""
    return db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()

def update_prompt(db: Session, prompt_id: int, prompt_data: schemas.PromptCreate):
    """Update a user's prompt."""
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt:
        db_prompt.title = prompt_data.title
        db_prompt.text = prompt_data.text
        db_prompt.category = prompt_data.category
        db.commit()
        db.refresh(db_prompt)
    return db_prompt

def delete_prompt(db: Session, prompt_id: int):
    """Delete a prompt from the database."""
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt:
        db.delete(db_prompt)
        db.commit()
    return db_prompt

def create_shared_item(db: Session, item: schemas.SharedItemCreate, user_id: int):
    """Create a new shared item for a user."""
    db_item = models.SharedItem(**item.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_shared_items_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Fetch all shared items owned by a specific user."""
    return db.query(models.SharedItem).filter(models.SharedItem.owner_id == user_id).offset(skip).limit(limit).all()

def get_all_shared_items(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all shared items from all users for the public collection."""
    # The fix is here: Eager load the 'owner' relationship
    return db.query(models.SharedItem).options(joinedload(models.SharedItem.owner)).order_by(models.SharedItem.id.desc()).offset(skip).limit(limit).all()

# Add these two new functions at the end of crud.py

def update_user_details(db: Session, user_id: int, user_update: schemas.UserUpdate):
    """Update a user's full name."""
    db_user = get_user_by_id(db, user_id=user_id)
    if db_user and user_update.full_name:
        db_user.full_name = user_update.full_name
        db.commit()
        db.refresh(db_user)
    return db_user

def update_user_password(db: Session, user: models.User, new_password: str):
    """Update a user's password."""
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all users."""
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_data: schemas.UserUpdate):
    """
    Update a user's details (e.g., role, is_active status).
    """
    db_user = get_user_by_id(db, user_id=user_id)
    if db_user:
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """
    Delete a user from the database.
    """
    db_user = get_user_by_id(db, user_id=user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# Add this new function at the end of crud.py

def get_user_by_id(db: Session, user_id: int):
    """Fetch a single user by their ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()