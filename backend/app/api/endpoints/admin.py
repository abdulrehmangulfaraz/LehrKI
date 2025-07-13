# backend/app/api/endpoints/admin.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...db import crud, models
from ...core.auth import get_current_user, get_db

router = APIRouter()

def require_admin(current_user: models.User = Depends(get_current_user)):
    """Dependency to ensure the user is an admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user

@router.get("/users", response_model=List[schemas.User], dependencies=[Depends(require_admin)])
def read_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all users. Admin-only endpoint.
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.put("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(require_admin)])
def update_user_by_admin(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a user's details. Admin-only endpoint.
    """
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.update_user(db=db, user_id=user_id, user_data=user_update)

@router.delete("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(require_admin)])
def delete_user_by_admin(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a user. Admin-only endpoint.
    """
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return crud.delete_user(db=db, user_id=user_id)

# Add this new function inside admin.py

@router.get("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(require_admin)])
def read_single_user_by_admin(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single user by ID. Admin-only endpoint.
    """
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user