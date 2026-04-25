from app.api.routes import comparison, dashboard

api_router.include_router(comparison.router)
api_router.include_router(dashboard.router)
