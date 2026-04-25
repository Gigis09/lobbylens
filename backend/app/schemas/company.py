from pydantic import BaseModel

class CompanyOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True