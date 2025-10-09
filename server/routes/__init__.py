# server/routes/__init__.py
from .snippets import router as snippets_router
from .auth import router as auth_router

# (later you'll add others, e.g.)
# from .auth import router as auth_router

__all__ = ["snippets_router", "auth_router"]