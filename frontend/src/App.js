import React, { useState, useCallback } from 'react';
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
import './App.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(undefined);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login, 
        logout: logout 
      }}
    >
      <BrowserRouter>
          <MainNavigation />
          <main>
              {isLoggedIn ? (
                <Routes>
                  <Route path="/parties/all" element={<Parties />} />
                  <Route path="/parties/new" element={<NewParty/>} />
                  <Route path="/parties/:userId" element={<UserInfo />} />
                  <Route path="/parties/party/:partyId" element={<UpdateParty />} />
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
