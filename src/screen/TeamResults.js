import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { ResultList } from "./ResultList";
import { TIME } from "../config/config";

function TeamResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    console.log("fetchRecord is invoked");
    const filter = {
      or: [{ time: { eq: TIME } }],
    };

    const apiData = await API.graphql({
      query: listRecords,
      variables: { filter: filter },
    });

    const teams = extractTeamArray(apiData.data.listRecords.items);
    console.log("=== print teams ===");
    console.log(teams);

    const results = groupByTeamResult(teams, apiData.data.listRecords.items);
    console.log("=== results(groupBy) ===");
    console.log(results);

    const rankedResults = rankResults(results);
    console.log("=== rankedResults ===");
    console.log(rankedResults);

    setResults(rankedResults);
  }

  // teamをarrayから抽出する
  const extractTeamArray = (items) => {
    items.sort((a, b) => {
      if (a.team > b.team) {
        return 1;
      } else {
        return -1;
      }
    });
    const teams = [];
    items.forEach((item) => {
      if (teams.includes(item.team)) {
        // no-ope
      } else {
        teams.push(item.team);
      }
    });
    return teams;
  };

  // team毎に、合計タイムを算出する
  const groupByTeamResult = (teams, items) => {
    const results = [];
    teams.forEach((team) => {
      const Result = {
        rank: 0,
        team: "",
        result: "",
        resultInt: 0,
        toInt: function () {
          //00:25:01
          this.resultInt +=
            Number(this.result.substring(0, 2)) * 3600 +
            Number(this.result.substring(3, 5)) * 60 +
            Number(this.result.substring(6, 8));
        },
        toString: function () {
          const hour = Math.floor(this.resultInt / 3600);
          const hourRemain = this.resultInt % 3600;
          const minute = Math.floor(hourRemain / 60);
          const second = hourRemain % 60;
          this.result = "" + hour + ":" + minute + ":" + second;
        },
      };
      let resultRow = Object.create(Result);
      items
        .filter((item) => item.team === team)
        .forEach((item) => {
          resultRow.team = item.team;
          resultRow.result = item.result;
          resultRow.toInt();
          // console.log(resultRow.resultInt);
          resultRow.toString();
        });
      // console.log('push here');
      // console.log(resultRow);
      results.push(resultRow);
    });
    return results;
  };

  const rankResults = (results) => {
    results.sort((a, b) => {
      if (a.resultInt > b.resultInt) {
        return 1;
      } else {
        return -1;
      }
    });
    let i = 0;
    results.forEach((result) => {
      result.rank = ++i;
    });
    return results;
  };

  return (
    <div className="App">
      <h3>Team result</h3>
      <ResultList results={results} />
      {/* <RecordList records={results} /> */}
      <nav>
        <ul>
          <li>
            <Link to="/sectionRecords">See sectional prize</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(TeamResults);
