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