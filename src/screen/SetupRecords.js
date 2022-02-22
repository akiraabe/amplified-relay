import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { createRecord as createRecordMutation, deleteRecord as deleteRecordMutation } from "../graphql/mutations";
import { INITIAL_DATA } from "../config/config";


const initialDatas = INITIAL_DATA;

function SetupRecords() {
  useEffect(() => {
    setupRecords();
  }, []);

  async function setupRecords() {
    console.log("setupRecords is invoked");

    const apiData = await API.graphql({
      query: listRecords,
    });

    apiData.data.listRecords.items.forEach((item) => {
      deleteRecord(item);
    });

    /* setup data */
    // initialDatas.forEach((item) => {
    //   createRecord(item);
    // });

    console.log(apiData);
  }

  async function deleteRecord({ id }) {
    await API.graphql({
      query: deleteRecordMutation,
      variables: { input: { id } },
    });
  }

  async function createRecord(item) {
    await API.graphql({ query: createRecordMutation, variables: { input: item } });
  }

  return (
    <div className="App">
      <h3>Record is setupped</h3>
      <nav>
        <ul>
          <li>
            <Link to="/">See all records</Link>
          </li>
          <li>
            <Link to="/topRecords">See top records</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(SetupRecords);
