import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./shared/components/context/auth-context";

let logOutTimerId;

//TODO: add a state isCheckingAuth=useState(true)-display a message: please wait.setIsCheckingAuth(false) inside useEffect
const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //Set expiration date for the token
    const myTokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //current date + 1h [(1000milisec*60=1min)*60=1h )]
    console.log("myTokenExpirationDate: ", myTokenExpirationDate);
    setTokenExpirationDate(myTokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: myTokenExpirationDate.toISOString(),
      })
    );
    console.log(JSON.parse(localStorage.getItem("userData")));
  }, []);

  const logout = useCallback(() => {
    // restart all states
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
  }, []);

  //token change if user login/logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      //user logged in

      //calculate the remaining time - in Milisec
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logOutTimerId = setTimeout(logout, remainingTime);
    } else {
      //user logged out - manually or automatically
      clearTimeout(logOutTimerId); //The clearTimeout() method requires the id returned by setTimeout() to know which setTimeout() method to cancel
    }
  }, [token, logout, tokenExpirationDate]);

  /*CHECK USER ID FOR AUTO-LOGIN (stay logged in after page refresh)
   runs only once, when the component mounts-renders for the first time*/
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      // we have a token and a VALID one so we can login
      console.log("AUTO-LOGIN");
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;
  if (token) {
    /*the order matters cuz /places/new can be read as a placeId and then this Route will be overrided */
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    /*Every component that is rapped in AuthContext has access to it.
    Once the value change all the components that listen to this context will re-render*/
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token, //!! convert string to true and null to false
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
