import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NewPlace from "./places/pages/NewPlace";
import Users from "./user/pages/Users";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>
        <Route path="/places/new" exact={true}>
          <NewPlace />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
