from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

class Player(db.Model, SerializerMixin):
    __tablename__ = "fighter_table"
    # serialize_rules= ['-order_parts.part']
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    

class Team(db.Model, SerializerMixin):
    __tablename__ = "event_table"
    serialize_rules= ['-event_matches.event']
    id = db.Column(db.Integer, primary_key=True)


class Match(db.Model, SerializerMixin):
    __tablename__ = "match_table"
    serialize_rules= ['-event.event_matches','-comments.matches']
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("event_table.id"))
    fighter1_id = db.Column(db.Integer, db.ForeignKey("fighter_table.id"))

    event=db.relationship("Event",back_populates="event_matches")
    # event relationship one


class User(db.Model, SerializerMixin):
    __tablename__ = "user_table"
    serialize_rules = ["-comments.user"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    # we store the hash of the password, not the password itself
    # DO NOT store the password itself
    password_hash = db.Column(db.String)
    comments = db.relationship("Comment", back_populates="user")

class Comment(db.Model, SerializerMixin):
    __tablename__ = "comment_table"
    serialize_rules = ["-event.comments", '-user.comments']
    # canvas serialize_rules = ('-restaurant.reviews',)
    id = db.Column(db.Integer, primary_key=True)
    # rating = db.Column(db.Integer)
    review = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("user_table.id"))

    user = db.relationship("User", back_populates="comments")
    event = db.relationship("Event", back_populates="comments")
