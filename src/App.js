import React from "react";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import InputRecord from "./screen/InputRecord";
import AllRecordsBoard from "./screen/AllRecordsBoard";
import TopRecors from "./screen/TopRecors";
import SectionRecords from "./screen/SectionRecords";
import TeamResults from "./screen/TeamResults";
import SetupRecords from "./screen/SetupRecords";

function App() {
  return (
    <div className="App">
      <h1>Ekiden App</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <AllRecordsBoard />
          </Route>
          <Route exact path="/inputRecord">
            <InputRecord />
          </Route>
          <Route exact path="/topRecords">
            <TopRecors />
          </Route>
          <Route exact path="/sectionRecords">
            <SectionRecords />
          </Route>
          <Route exact path="/teamResults">
            <TeamResults />
          </Route>
          <Route exact path="/setupRecords">
            <SetupRecords />
          </Route>
        </Switch>
      </BrowserRouter>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
