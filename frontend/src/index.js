import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';

import './App.css';
import Predictions from './Predictions';
import Search from './Search';
import PlayerPage from './PlayerPage';
import TeamSearch from './TeamSearch';
import TeamPage from './TeamPage';
import Model from './Model';
import PredictPoints from './PredictPoints';
import About from './About';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/predictions",
        element: <Predictions />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/player-page/:playerId",
        element: <PlayerPage />
      },
      {
        path: "/team-search",
        element: <TeamSearch />
      },
      {
        path: "/team-page/:teamAbbreviation/:teamId",
        element: <TeamPage />
      },
      {
        path: "/predict-points",
        element: <PredictPoints />
      },
      {
      path: "/about",
      element: <About />
      }
      
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
