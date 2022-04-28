import React from "react";
import Stats from "../components/stats";
import { DownloadIcon } from "@heroicons/react/solid";

export default function Info() {
  return (
    <>
      <Stats />
      <div className="mt-6 text-center">
        <button className="flex space-x-2 hover:bg-orange-200 mx-auto shadow-inner items-center justify-center text-orange-700 px-12 py-3 rounded-md border-2 border-orange-300">
          <DownloadIcon className="w-4 h-4 opacity-60" />
          <span>Download Applications</span>
        </button>
      </div>
    </>
  );
}
