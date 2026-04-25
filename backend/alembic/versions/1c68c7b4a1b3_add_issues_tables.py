from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1c68c7b4a1b3"
down_revision = "784092afe93c"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "issues",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "filing_issues",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filing_id", sa.Integer(), nullable=False),
        sa.Column("issue_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["filing_id"], ["filings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["issue_id"], ["issues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("filing_id", "issue_id"),
    )


def downgrade():
    op.drop_table("filing_issues")
    op.drop_table("issues")