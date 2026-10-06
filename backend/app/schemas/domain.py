from pydantic import BaseModel
from typing import List, Dict, Any

class DomainInfo(BaseModel):
    id: str
    name: str
    description: str
    target_column: str
    sample_columns: List[str]
    column_count: int

class DomainListResponse(BaseModel):
    domains: List[DomainInfo]
