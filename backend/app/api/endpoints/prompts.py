# backend/app/api/endpoints/prompts.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...db import crud, models
from ...core.auth import get_current_user, get_db

router = APIRouter()

@router.post("/", response_model=schemas.Prompt)
def create_prompt(
    prompt: schemas.PromptCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new prompt for the current logged-in user.
    """
    return crud.create_user_prompt(db=db, prompt=prompt, user_id=current_user.id)


@router.get("/", response_model=List[schemas.Prompt])
def read_prompts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all prompts for the current logged-in user.
    """
    prompts = crud.get_prompts_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return prompts