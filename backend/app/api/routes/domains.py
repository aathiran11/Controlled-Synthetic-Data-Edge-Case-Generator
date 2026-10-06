from fastapi import APIRouter
from app.schemas.domain import DomainListResponse, DomainInfo
from app.generator.domain_presets import get_domain_info_list

router = APIRouter()

@router.get("/domains", response_model=DomainListResponse)
def get_domains():
    """
    Returns available domain presets and their schema metadata.
    Supported presets: E-commerce, Finance, Healthcare, Logistics, IoT.
    """
    raw_domains = get_domain_info_list()
    domain_models = [DomainInfo(**d) for d in raw_domains]
    return DomainListResponse(domains=domain_models)
