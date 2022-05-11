import React, { useContext } from "react";
import * as Server from "../../server";
import Stats from "../components/stats";
import { DownloadIcon } from "@heroicons/react/solid";
import { AppContext } from "../../context";
import { ContestContext } from "../../context/contestContext";

export default function Info() {
  const { selected, downloadContest } = useContext(ContestContext);

  async function download() {
    const url = await downloadContest();
    window.open(url, "_blank");
  }
  return (
    <>
      <Stats />
      <div className="mt-6 text-center">
        <button
          onClick={download}
          className="flex space-x-2 hover:bg-orange-200 mx-auto shadow-inner items-center justify-center text-orange-700 px-12 py-3 rounded-md border-2 border-orange-300"
        >
          <DownloadIcon className="w-4 h-4 opacity-60" />
          <span>Download Applications</span>
        </button>
      </div>
    </>
  );
}
