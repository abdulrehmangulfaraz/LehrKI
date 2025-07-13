# backend/app/schemas.py

from pydantic import BaseModel, EmailStr

# Schema for creating a new user (request)
class UserCreate(BaseModel):
    full_name: str 
    email: EmailStr
    password: str

# Schema for reading user data (response)
class User(BaseModel):
    id: int
    full_name: str 
    email: EmailStr
    is_active: bool
    role: str

    class Config:
        from_attributes = True

# Schema for the login request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for the token response
class Token(BaseModel):
    access_token: str
    token_type: str
    user_role: str # Add this line

# Schema for data embedded in the token
class TokenData(BaseModel):
    email: EmailStr | None = None

# Schema for creating a new prompt (request)
class PromptBase(BaseModel):
    title: str
    text: str
    category: str | None = None

class PromptCreate(PromptBase):
    pass

class Prompt(PromptBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True # This is important for SQLAlchemy models