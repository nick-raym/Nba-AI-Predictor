from app import app
from models import db, Player, Team, Match, User, Comment
from faker import Faker
from random import randint, choice, choices, uniform
import json
from flask_bcrypt import Bcrypt
# import requests


fake = Faker()

if __name__ == "__main__":
    with app.app_context():
        
        bcrypt = Bcrypt(app)
        data = {}
        # get the json as a dict
        with open("db.json") as f:
            data = json.load(f)
        
        Player.query.delete()
        Team.query.delete()
        Match.query.delete()
        Comment.query.delete()
        User.query.delete()

        player_list = []
        for d in data["players"]:
            image = d.get("image") 
            p = Player(
                name=d.get("name"),
            )
            player_list.append(p)
        db.session.add_all(player_list)
        db.session.commit()

        


        reviewer = User(
                name='Nick',
                password_hash=bcrypt.generate_password_hash("a"),
            )
        db.session.add(reviewer)
        db.session.commit()
        
        reviewer2 = User(
                name='Amannino',
                password_hash=bcrypt.generate_password_hash("a"),
            )
        db.session.add(reviewer2)
        db.session.commit()





        # c = Comment(review="Alex Periera Boutta show Hill who the real champ is.",user_id=reviewer.id,event_id=choice(event_list).id)
        # db.session.add(c)
        # db.session.commit()

        # c = Comment(review="Holloway vs. Gaethje is a BANGER",user_id=reviewer.id,event_id=choice(event_list).id)
        # db.session.add(c)
        # db.session.commit()


