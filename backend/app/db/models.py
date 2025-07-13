from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship 
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True) 
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="teacher") # e.g., 'teacher', 'admin'

    prompts = relationship("Prompt", back_populates="owner")
    shared_items = relationship("SharedItem", back_populates="owner")
    
    
class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    text = Column(Text, nullable=False)
    category = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="prompts")

class SharedItem(Base):
    __tablename__ = "shared_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    content_type = Column(String)  # e.g., 'gpt', 'idea', 'resource'

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="shared_items")