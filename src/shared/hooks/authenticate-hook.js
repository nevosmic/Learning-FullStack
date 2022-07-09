import { useState, useEffect, useCallback } from "react";

let logOutTimerId;

export const useAuthenticate = () => {
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
    console.log("logout");
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    // remove user record from local storage!
    localStorage.removeItem("userData");
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

  return { token, login, logout, userId };
};
