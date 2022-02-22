import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listRecords } from "../graphql/queries";
import { createRecord as createRecordMutation } from "../graphql/mutations";
import { RecordList } from "./RecordList";
import { TIME } from "../config/config"

const initialFormState = {
  name: "",
  discordId: "",
  time: "",
  turn: "",
  team: "",
  result: "",
  description: "",
};

function InputRecords() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
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

  async function createRecord() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createRecordMutation,
      variables: { input: formData },
    });
    setRecords([...records, formData]);
    setFormData(initialFormState);
  }

  return (
    <div className="App">
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, discordId: e.target.value })
        }
        placeholder="DiscordId"
        value={formData.discordId}
      />
      <input
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        placeholder="Time"
        value={formData.time}
      />
      <input
        onChange={(e) => setFormData({ ...formData, turn: e.target.value })}
        placeholder="Turn"
        value={formData.turn}
      />
      <input
        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
        placeholder="Team"
        value={formData.team}
      />
      <input
        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
        placeholder="Result time"
        value={formData.result}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Record description"
        value={formData.description}
      />
      <button onClick={createRecord}>Create Record</button>
      <RecordList records={records} />
      <nav>
        <ul>
          <li>
            <Link to="/">See all records</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withAuthenticator(InputRecords);
