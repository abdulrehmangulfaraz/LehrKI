# backend/app/api/endpoints/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ... import schemas
from ...db import crud, models
from ...core.auth import get_current_user, get_db, verify_password

router = APIRouter()

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update details for the current user.
    """
    return crud.update_user_details(db=db, user_id=current_user.id, user_update=user_update)

@router.put("/me/password")
def update_password_me(
    password_update: schemas.PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update password for the current user.
    """
    if not verify_password(password_update.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    crud.update_user_password(db=db, user=current_user, new_password=password_update.new_password)
    return {"message": "Password updated successfully"}