from flask import Flask, make_response, jsonify, request, session, g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
from sqlite3 import IntegrityError
from sqlalchemy import exc
from models import db, Match, Player, Team, User, Comment
import numpy as np
import pandas as pd
from pandas import Series
import dill as pickle


from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelog, playergamelog, leaguegamefinder
from nba_api.live.nba.endpoints import boxscore
from nba_api.stats.endpoints import boxscoretraditionalv2
from nba_api.stats.static import players
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.endpoints import playerfantasyprofile
from nba_api.stats.endpoints import commonteamroster
from nba_api.stats.endpoints import TeamYearByYearStats
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error


import json

config = dotenv_values(".env")

app = Flask(__name__)
app.debug = True
app.secret_key = config["FLASK_SECRET_KEY"]
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
# points a player would score vs a certain team
#
db.init_app(app)


@app.route("/teams")
def get_teams():
    nba_teams = teams.get_teams()
    return jsonify(nba_teams)


@app.route("/players")
def get_players():
    try:
        nba_players = players.get_players()

        return jsonify(nba_players)
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500


# 203507 giannis id
@app.route("/player-stats/<player_id>/<start>/<end>")
def get_player_stats_multiple_seasons(player_id, start, end):
    print(start)
    print(end)
    try:
        # Get player stats for each season
        player_stats = {}
        for season in range(int(start), int(end) + 1):  # Change the range as needed
            gamelog = playergamelog.PlayerGameLog(player_id=player_id, season=season)
            gamelog_data = gamelog.get_data_frames()

            player_stats[str(season)] = gamelog_data[0].to_dict(orient="records")

        # Return player stats as JSON
        return jsonify(player_stats)
    except Exception as e:
        # Handle errors
        print(e)
        return jsonify({"error": str(e)}), 500


# 203507 Giannis ID
@app.route("/player-info/<player_id>")
def get_player_info(player_id):
    try:
        # Get player information
        player_info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        player_info_data = player_info.get_data_frames()[0].to_dict(orient="records")

        # Return player information as JSON
        return jsonify(player_info_data)
    except Exception as e:
        # Handle errors
        print(e)
        return jsonify({"error": str(e)}), 500


# 203507 Giannis ID
@app.route("/player-fantasy-info/<player_id>")
def get_player_fantasy_info(player_id):
    try:
        # Fetch player fantasy profile data
        fantasy_profile = playerfantasyprofile.PlayerFantasyProfile(player_id=player_id)
        fantasy_profile_data = fantasy_profile.get_normalized_dict()

        # Return fantasy profile data as JSON
        return jsonify(fantasy_profile_data)
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500


# NYK
@app.route("/team-stats")
def get_team_stats():
    # Specify the team ID for the team you want to retrieve stats for
    team_id = 1610612737  # Atlanta Hawks as an example

    # Instantiate the endpoint and fetch the data
    team_log = teamgamelog.TeamGameLog(team_id=team_id)
    team_stats = team_log.get_normalized_dict()

    return jsonify(team_stats)


@app.route("/team_last_5_games/<team_id>")
def get_team_last_5_games(team_id):
    # Retrieve the last 5 games for the team using NBA API
    team_log = teamgamelog.TeamGameLog(team_id=team_id)
    team_log_data = team_log.get_data_frames()[0]
    # Filter the last 5 games
    last_5_games = team_log_data.head(5)
    return jsonify(last_5_games.to_dict(orient="records"))


@app.route("/team-roster/<team_abbreviation>")
def get_team_roster(team_abbreviation):

    try:
        # Get the dictionary for the specified team abbreviation
        nba_teams = teams.get_teams()
        team = [
            team for team in nba_teams if team["abbreviation"] == team_abbreviation
        ][0]
        team_id = team["id"]

        # Query for the team's roster
        roster = commonteamroster.CommonTeamRoster(team_id=team_id)
        roster_data = roster.get_data_frames()[0]

        # Return the roster data as JSON
        # print(roster_data.to_json(orient='records'))
        return roster_data.to_json(orient="records")
    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500


# 0022000196 GAME ID
@app.route("/boxscore/<game_id>")
def get_boxscore(game_id):
    # Instantiate the BoxScore endpoint with the specified game ID
    box = boxscore.BoxScore(game_id)

    # Fetch the box score data
    box_score_data = box.get_dict()

    # Check if the data is available
    if box_score_data:
        return jsonify(box_score_data)
    else:
        return jsonify({"error": "Box score data not found"})


@app.route("/team-games/<team_abbreviation>")
def get_team_games(team_abbreviation):
    nba_teams = teams.get_teams()

    team = [team for team in nba_teams if team["abbreviation"] == team_abbreviation][0]
    team_id = team["id"]

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
    games_json = games.to_json(orient="records")
    return jsonify(games_json)

features = [
        "AST",
        "REB",
        "PLUS_MINUS",
        "MIN",
        "TOV",
        "PF",
        "FTA",
    ]  
target = ["PTS"]
# gamelog_dame = playergamelog.PlayerGameLog(player_id=Dame_id, season=2023)
# gamelog_data_dame = gamelog_dame.get_json()[0]
# latest_dame_stats = gamelog_data_dame.iloc[-10][features].values
# latest_dame_points = gamelog_data_dame.iloc[-10][target].values
@app.route("/last-game-stats/<player_id>")
def get_last_game_stats(player_id):
    gamelog_player = playergamelog.PlayerGameLog(player_id=player_id, season=2023)
    gamelog_data = gamelog_player.get_data_frames()[0]
    latest_stats = gamelog_data.iloc[-1][features].values.astype(int).tolist()  # Convert to regular integers and then to list
    latest_pts = gamelog_data.iloc[-1][target].values.astype(int).tolist()  # Convert to regular integers and then to list
    
    return jsonify({'features': latest_stats, 'pts': latest_pts[0]})


# 203507/GSW
@app.route("/player-point-averages/<player_id>/<team_abbreviation>")
def get_player_point_averages_vs_team(player_id, team_abbreviation):
    # Get the dictionary for the specified team abbreviation
    nba_teams = teams.get_teams()
    team = [team for team in nba_teams if team["abbreviation"] == team_abbreviation][0]
    team_id = team["id"]

    # Query for the player's game logs
    player_log = playergamelog.PlayerGameLog(player_id=player_id)
    player_stats = player_log.get_data_frames()[0]
    print(player_stats.head())
    # Filter game logs to include only games against the specified team
    games_against_team = player_stats[
        player_stats["MATCHUP"].str.contains(team_abbreviation)
    ]

    # Calculate point averages for those games
    total_points = games_against_team["PTS"].astype(float).sum()
    total_games = len(games_against_team)
    point_average = total_points / total_games if total_games > 0 else 0

    # Return point average as JSON
    return jsonify(
        {
            "player_id": player_id,
            "team_abbreviation": team_abbreviation,
            "point_average": point_average,
        }
    )


# print(teams.get_teams())
@app.route("/year-by-year-stats/<team_id>")
def get_team_year_by_year_stats(team_id):
    team_stats = TeamYearByYearStats(team_id=team_id)

    team_stats_df = team_stats.get_data_frames()[0]

    # Replace NaN values with a default value, such as None
    team_stats_df = team_stats_df.fillna("")

    tm_stats_json = team_stats_df.to_dict(orient="records")

    return jsonify(tm_stats_json)


# Define function to load the saved model and make predictions
def load_pkl(stats_to_predict):
    # Load the saved model
    path_to_pipeline = "./saved_models/full_pipeline.pkl"
    with open(path_to_pipeline, "rb") as frb_pipeline:
        modeling_pipeline = pickle.load(frb_pipeline)
    
    
    # Make predictions using the loaded model
    predicted_points = modeling_pipeline.predict(np.array([stats_to_predict]))
    
    return predicted_points[0]

# Define route for prediction
@app.route("/prediction-test")
def prediction():
    # Predefined statistics in the desired order
    stats_to_predict = [8, 12, 10, 34, 3, 2, 0.55, 6, 0.42]

    # stats_to_predict = {
    #     "assists": 8,
    #     "rebounds": 12,
    #     "plus_minus": 10,
    #     "minutes": 34,
    #     "turnovers": 3,
    #     "personal_fouls": 2,
    #     "field_goal_percentage": 0.55,
    #     "free_throw_attempts": 6,
    #     "three_point_percentage": 0.42,
    # }


    # Make predictions using the loaded model
    predicted_points = load_pkl(stats_to_predict)

    # Return the predicted points
    return jsonify({"predicted_points": predicted_points})






# Define route for prediction
@app.route("/predict", methods=["POST"])
def predict_stats():
    # Get the input data from the request
    input_data = request.json

    # Make predictions using the loaded model
    predicted_points = load_pkl(input_data)

    # Return the predicted points
    return jsonify({"predicted_points": predicted_points})



 # stats_to_predict = {
    #     "assists": 8,
    #     "rebounds": 12,
    #     "plus_minus": 10,
    #     "minutes": 34,
    #     "turnovers": 3,
    #     "personal_fouls": 2,
    #     "field_goal_percentage": 0.55,
    #     "free_throw_attempts": 6,
    #     "three_point_percentage": 0.42,
    # }

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
