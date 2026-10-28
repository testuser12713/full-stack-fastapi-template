"""add priority to item

Revision ID: 0099783fc29c
Revises: fe56fa70289e
Create Date: 2026-10-28 19:14:37.020057

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0099783fc29c'
down_revision = 'fe56fa70289e'
branch_labels = None
depends_on = None

item_priority = postgresql.ENUM("low", "medium", "high", name="itempriority")


def upgrade():
    item_priority.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "item",
        sa.Column(
            "priority",
            postgresql.ENUM(
                "low",
                "medium",
                "high",
                name="itempriority",
                create_type=False,
            ),
            server_default="medium",
            nullable=False,
        ),
    )


def downgrade():
    op.drop_column("item", "priority")
    item_priority.drop(op.get_bind(), checkfirst=True)
