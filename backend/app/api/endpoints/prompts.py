# backend/app/api/endpoints/prompts.py

from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/public", response_model=List[schemas.PromptPublic])
def read_public_prompts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all prompts from all users for the public collection.
    """
    prompts = crud.get_all_prompts(db, skip=skip, limit=limit)
    return prompts

@router.get("/{prompt_id}", response_model=schemas.Prompt)
def read_single_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve a single prompt by its ID.
    Ensures the prompt belongs to the current user.
    """
    db_prompt = crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt

@router.put("/{prompt_id}", response_model=schemas.Prompt)
def update_single_prompt(
    prompt_id: int,
    prompt: schemas.PromptCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update a prompt owned by the current user.
    """
    db_prompt = crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found")

    return crud.update_prompt(db=db, prompt_id=prompt_id, prompt_data=prompt)

@router.delete("/{prompt_id}", response_model=schemas.Prompt)
def delete_user_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a prompt owned by the current user.
    """
    db_prompt = crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found")

    crud.delete_prompt(db=db, prompt_id=prompt_id)
    return db_prompt