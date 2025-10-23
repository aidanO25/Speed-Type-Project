# server/routes/__init__.py
from .snippets import router as snippets_router
from .auth import router as auth_router
from .createAcc import router as createAcc_router
from .attemptLog import router as attemptLog_router
from .profileData import router as profileData_router 

# (later you'll add others, e.g.)
# from .auth import router as auth_router

__all__ = ["snippets_router", "auth_router", "createAcc_router, attemptLog_router, profileData_router"]