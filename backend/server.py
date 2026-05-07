import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from autogen.beta.ag_ui import AGUIStream

from .agents import consultant

logging.basicConfig(level=logging.INFO, format="%(name)s: %(message)s")
logger = logging.getLogger("futureme.server")

app = FastAPI(title="futureMe")

_allowed_origins = os.environ.get(
    "CORS_ORIGINS", "http://localhost:3000,http://localhost:3002"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stream = AGUIStream(consultant)
app.mount("/chat", stream.build_asgi())


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error. Please try again."},
    )
