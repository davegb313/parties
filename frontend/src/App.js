import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Parties from './parties/pages/Parties';
import MainNavigation from './shared/Navigation/MainNavigation';
import NewParty from './parties/pages/NewParty';
import UpdateParty from './parties/pages/UpdateParty';
import Auth from './user/Auth';
import UserInfo from './user/UserInfo';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import './App.css';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          {token ? (
            <Routes>
              <Route path="/parties/all" element={<Parties />} />
              <Route path="/parties/new" element={<NewParty />} />
              <Route path="/parties/party/:partyId" element={<UpdateParty />} />
              <Route path="/user/:userId" element={<UserInfo />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/parties/all" element={<Parties />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          )}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
