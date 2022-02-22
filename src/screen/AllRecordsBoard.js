import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { RecordList } from "./RecordList";
import { TIME } from "../config/config";

function AllRecordsBoard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    console.log("fetchRecords is invoked");
    let filter = {
      or: [{ time: { eq: TIME } }],
    };

    const apiData = await API.graphql({
      query: listRecords,
      variables: { filter: filter },
    });

    apiData.data.listRecords.items.sort((a, b) => {
      if (a.turn + a.team > b.turn + b.team) {
        return 1;
      } else {
        return -1;
      }
    });

    console.log(apiData);

    setRecords(apiData.data.listRecords.items);
  }

  return (
    <div className="App">
      <h3>All Records</h3>
      <RecordList records={records} />
      <nav>
        <ul>
          <li>
            <Link to="/inputRecord">Input record</Link>
          </li>
          <li>
            <Link to="/topRecords">See top records</Link>
          </li>
          <li>
            <Link to="/setupRecords">Setup records</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(AllRecordsBoard);
