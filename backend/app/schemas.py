# backend/app/schemas.py

from pydantic import BaseModel, EmailStr

# Schema for creating a new user (request)
class UserCreate(BaseModel):
    full_name: str 
    email: EmailStr
    password: str
    role: str = "teacher"

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

class PromptPublic(Prompt):
    owner: User

# Schema for creating a new shared item (request)
class SharedItemBase(BaseModel):
    title: str
    description: str | None = None
    url: str | None = None
    content_type: str

class SharedItemCreate(SharedItemBase):
    pass

class SharedItem(SharedItemBase):
    id: int
    owner_id: int
    owner: User # This will nest the user's info in the response

    class Config:
        from_attributes = True

# Schema for updating user information
class UserUpdate(BaseModel):
    full_name: str | None = None
    role: str | None = None
    is_active: bool | None = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


