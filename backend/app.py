from flask import Flask, make_response, jsonify, request, session, g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
from sqlite3 import IntegrityError
from sqlalchemy import exc 
from models import db,Match,Player,Team,User,Comment
import pandas as pd
from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelog, playergamelog,leaguegamefinder
from nba_api.live.nba.endpoints import boxscore



import json

config = dotenv_values(".env")

app = Flask(__name__)
app.debug = True
app.secret_key = config['FLASK_SECRET_KEY']
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
# points a player would score vs a certain team
# 
db.init_app(app)

@app.route('/teams')
def get_teams():
    nba_teams = teams.get_teams()
    return jsonify(nba_teams)

@app.route('/team-stats')
def get_team_stats():
    # Specify the team ID for the team you want to retrieve stats for
    team_id = 1610612737  # Atlanta Hawks as an example
    
    # Instantiate the endpoint and fetch the data
    team_log = teamgamelog.TeamGameLog(team_id=team_id)
    team_stats = team_log.get_normalized_dict()

    return jsonify(team_stats)


@app.route('/boxscore/<game_id>')
def get_boxscore(game_id):
    # Instantiate the BoxScore endpoint with the specified game ID
    box = boxscore.BoxScore(game_id)
    
    # Fetch the box score data
    box_score_data = box.get_dict()
    
    # Check if the data is available
    if box_score_data:
        return jsonify(box_score_data)
    else:
        return jsonify({'error': 'Box score data not found'})
    
@app.route('/team-games/<team_abbreviation>')
def get_team_games(team_abbreviation):
    nba_teams = teams.get_teams()

    team = [team for team in nba_teams if team['abbreviation'] == team_abbreviation][0]
    team_id = team['id']
    
    gamefinder = leaguegamefinder.LeagueGameFinder(team_id_nullable=team_id)
    # The first DataFrame of those returned is what we want.
    games = gamefinder.get_data_frames()[0]
    print(games.head())
    print(" ")
    print(games.SEASON_ID)
    print(" ")
    print(games.GAME_DATE)
    print(" ")
    print(games.MATCHUP)
    games_json = games.to_json(orient='records')
    return jsonify(games_json)

@app.route('/player-point-averages/<player_id>/<team_abbreviation>')
def get_player_point_averages(player_id, team_abbreviation):
    # Get the dictionary for the specified team abbreviation
    nba_teams = teams.get_teams()
    team = [team for team in nba_teams if team['abbreviation'] == team_abbreviation][0]
    team_id = team['id']
    
    # Query for the player's game logs
    player_log = playergamelog.PlayerGameLog(player_id=player_id)
    player_stats = player_log.get_data_frames()[0]
    print(player_stats.head())
    # Filter game logs to include only games against the specified team
    games_against_team = player_stats[player_stats['MATCHUP'].str.contains(team_abbreviation)]
    
    # Calculate point averages for those games
    total_points = games_against_team['PTS'].astype(float).sum()
    total_games = len(games_against_team)
    point_average = total_points / total_games if total_games > 0 else 0
    
    # Return point average as JSON
    return jsonify({'player_id': player_id, 'team_abbreviation': team_abbreviation, 'point_average': point_average})

# @app.get('/check_session')
# def check_session():
#     user = db.session.get(User, session.get('user_id'))
#     print(f'check session {session.get("user_id")}')
    
#     if user:
#         return user.to_dict(rules=['-password_hash']), 200
#     else:
#         # The first time a user visits a page (i.e. is not logged in)
#         # we will return this.
#         return {"message": "No user logged in"}, 401
    


# @app.post('/login')
# def login():
#     # get the data from the post request (dict of username/password)
#     data = request.json
#     # get the user based on username
#     user = User.query.filter(User.name == data.get('name')).first()

#     # check that the hash of supplied password matches the hash stored in the db
#     if user and bcrypt.check_password_hash(user.password_hash, data.get('password_hash')):
#         # if successful, set a key in the session with the user id
#         session["user_id"] = user.id
#         print("success")
        
#         return user.to_dict(), 200
#     else:
#         return { "error": "Invalid username or password" }, 401


# @app.post('/signup')
# def signup():
#     data = request.json
#     try:
#         # make a new object from the request json
#         user = User(
#             name=data.get("name"),
#             password_hash=bcrypt.generate_password_hash(data.get("password"))
#         )
#         # add to the db
#         db.session.add(user)
#         db.session.commit()
#         session["user_id"] = user.id
#         # return object we just made
#         return user.to_dict(), 201
#     except IntegrityError as e:
#         print("caught1")
#         print(e)
#         return {"error": f"username taken"}, 405
#     except exc.IntegrityError as e:
#         print("caught2")
#         print(e)
#         return {"error": f"username taken"}, 405
#     # except Exception as e:
#     #     # if anything in the try block goes wrong, execute this
#     #     print(e)
#     #     return {"error": f"could not post user {e}"}, 405


# @app.delete('/logout')
# def logout():
#     # logging out is simply removing the key we set in the session from log in
#     session.pop('user_id')
#     return { "message": "Logged out"}, 200


if __name__ == "__main__":
    app.run(port=5555, debug=True)