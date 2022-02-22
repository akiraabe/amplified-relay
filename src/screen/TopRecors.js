import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { RecordList } from "./RecordList";
import { TIME } from "../config/config";

function TopRecords() {
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
      if (a.result > b.result) {
        return 1;
      } else {
        return -1;
      }
    });

    console.log(apiData);

    const top = apiData.data.listRecords.items.slice(0,10);
    setRecords(top);
  }

  return (
    <div className="App">
      <h3>Top10 Records</h3>
      <RecordList records={records} />
      <nav>
        <ul>
          <li>
            <Link to="/inputRecord">Input record</Link>
          </li>
          <li>
            <Link to="/sectionRecords">See sectional prize records</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(TopRecords);
