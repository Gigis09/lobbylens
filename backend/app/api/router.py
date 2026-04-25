from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.companies import router as companies_router
from app.api.routes.spending import router as spending_router
from app.api.routes.issues import router as issues_router
from app.api.routes.dashboard import router as dashboard_router


api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(companies_router, tags=["companies"])
api_router.include_router(spending_router, tags=["spending"])
api_router.include_router(issues_router)
api_router.include_router(dashboard_router)