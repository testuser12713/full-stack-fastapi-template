"""Add priority to Item

Revision ID: 3f9c1a7b2d4e
Revises: fe56fa70289e
Create Date: 2026-10-28 00:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "3f9c1a7b2d4e"
down_revision = "fe56fa70289e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    item_priority = postgresql.ENUM(
        "low", "medium", "high", name="itempriority", create_type=False
    )
    item_priority.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "item",
        sa.Column(
            "priority",
            item_priority,
            nullable=False,
            server_default="medium",
        ),
    )


def downgrade() -> None:
    op.drop_column("item", "priority")
    postgresql.ENUM(name="itempriority").drop(op.get_bind(), checkfirst=True)
