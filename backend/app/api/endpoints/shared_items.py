# backend/app/api/endpoints/shared_items.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...db import crud, models
from ...core.auth import get_current_user, get_db

router = APIRouter()

@router.post("/", response_model=schemas.SharedItem)
def create_shared_item(
    item: schemas.SharedItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new shared item for the current logged-in user.
    """
    return crud.create_shared_item(db=db, item=item, user_id=current_user.id)


@router.get("/me", response_model=List[schemas.SharedItem])
def read_user_shared_items(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all shared items for the current logged-in user.
    """
    items = crud.get_shared_items_by_user(db, user_id=current_user.id)
    return items

@router.get("/public", response_model=List[schemas.SharedItem])
def read_public_shared_items(
    db: Session = Depends(get_db)
):
    """
    Retrieve all shared items from all users for the public collection.
    """
    items = crud.get_all_shared_items(db)
    return items