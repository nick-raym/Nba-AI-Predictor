import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';

import './App.css';
import Predictions from './Predictions';
import Search from './Search';
import PlayerPage from './PlayerPage';


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
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
