import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { ContestContext } from "../../context/contestContext";
import Form from "../components/from";

export default function Settings() {
  const { selected } = useContext(ContestContext);
  const { isNewContest } = useContext(AppContext);
  return (
    <div>
      {!isNewContest && (
        <h2 className="font-mono text-xl text-orange-600">
          URL:
          <a href={`../${selected?.id}`} className=" ">
            https://contest.com/<i>{selected?.id}</i>
          </a>
        </h2>
      )}

      <Form />
    </div>
  );
}
