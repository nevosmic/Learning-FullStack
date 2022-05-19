import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";

const App = () => {
  return (
    <Router>
      <main>
        <MainNavigation />
        <Switch>
          <Route path="/" exact={true}>
            <Users />
          </Route>
          <Route path="/places/new" exact={true}>
            <NewPlace />
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;
