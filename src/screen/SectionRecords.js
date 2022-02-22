import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { RecordList } from "./RecordList";
import { TIME } from "../config/config";

function SectionRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    console.log("fetchRecord is invoked");
    let filter = {
      or: [{ time: { eq: TIME } }],
    };

    const apiData = await API.graphql({
      query: listRecords,
      variables: { filter: filter },
    });

    const first = filterByTurn(1, apiData.data.listRecords.items);
    const second = filterByTurn(2, apiData.data.listRecords.items);
    const third = filterByTurn(3, apiData.data.listRecords.items);
    const fourth = filterByTurn(4, apiData.data.listRecords.items);
    const sectionalPrizes = first.concat(second, third, fourth);
    console.log(sectionalPrizes);

    setRecords(sectionalPrizes);
  }

  /**
   * 各区間の最速ランナーを返す
   * @param {*} turn
   * @param {*} items
   * @returns
   */
  const filterByTurn = (turn, items) => {
    const filtered = items.filter((item) => item.turn === turn);
    filtered.sort((a, b) => {
      if (a.result > b.result) {
        return 1;
      } else {
        return -1;
      }
    });
    const firstest = filtered.slice(0, 1);
    return firstest;
  };

  return (
    <div className="App">
      <h3>Sectional Prize Records</h3>
      <RecordList records={records} />
      <nav>
        <ul>
          <li>
            <Link to="/topRecords">See top records</Link>
          </li>
          <li>
            <Link to="/teamResults">See team results</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(SectionRecords);
