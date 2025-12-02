# backend/alembic/versions/0001_create_users_and_moods.py
"""create users and mood_entries tables

Revision ID: 0001_create_users_and_moods
Revises: 
Create Date: 2025-11-30 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_create_users_and_moods'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('anonymous', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'mood_entries',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('emotion', sa.String(length=64), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
    )

def downgrade():
    op.drop_table('mood_entries')
    op.drop_table('users')
