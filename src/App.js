import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

/*the order matters cuz /places/new can be read as a placeId and then this Route will be overrided */
const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact={true}>
            <Users />
          </Route>
          <Route path="/:userId/places" exact={true}>
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact={true}>
            <NewPlace />
          </Route>
          <Route path="/places/:placeId" exact={true}>
            <UpdatePlace />
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;
