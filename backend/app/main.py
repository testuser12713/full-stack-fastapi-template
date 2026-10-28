from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

import sentry_sdk
from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.routing import APIRoute
from sqlalchemy import inspect
from sqlmodel import Session, SQLModel
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.core.db import engine, init_db

BACKEND_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = Path(__file__).parent / "frontend"


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


def prepare_database() -> None:
    alembic_config = Config(str(BACKEND_DIR / "alembic.ini"))
    alembic_config.set_main_option(
        "script_location", str(BACKEND_DIR / "app" / "alembic")
    )
    if inspect(engine).has_table("alembic_version"):
        command.upgrade(alembic_config, "head")
        return
    SQLModel.metadata.create_all(engine)
    command.stamp(alembic_config, "head")


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    prepare_database()
    with Session(engine) as session:
        init_db(session)
    yield


if settings.SENTRY_DSN and settings.FASTAPI_ENV != "development":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_HOST],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
app.frontend("/", directory=FRONTEND_DIR)
