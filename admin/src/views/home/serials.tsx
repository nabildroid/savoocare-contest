import React, { useContext } from "react";
import { AppContext } from "../../context";
import Pagination from "../components/pagination";
import Table from "../components/table";

export default function Serials() {
  const { selectedSeller, selectSeller } = useContext(AppContext);
  return (
    <div>
      <div className="flex items-center">
        {selectedSeller && (
          <button
            onClick={() => selectSeller()}
            className="px-2 text-sm shadow-sm bg-gray-100 border border-gray-200 text-gray-800 rounded-full"
          >
            {selectedSeller.name}
          </button>
        )}
      </div>
      <Table />
      <div className="mt-6">
        <Pagination />
      </div>
    </div>
  );
}
