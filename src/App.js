import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//import Users from "./user/pages/Users";
//import NewPlace from "./places/pages/NewPlace";

//import UserPlaces from "./places/pages/UserPlaces";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import Authenticate from "./user/pages/Authenticate";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/components/context/auth-context";
import { useAuthenticate } from "./shared/hooks/authenticate-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner/LoadingSpinner";

// On demand loading
const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Authenticate = React.lazy(() => import("./user/pages/Authenticate"));

//TODO: add a state isCheckingAuth=useState(true)-display a message: please wait.setIsCheckingAuth(false) inside useEffect

const App = () => {
  const { token, login, logout, userId } = useAuthenticate();

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
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
