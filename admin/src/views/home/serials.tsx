import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { ContestContext } from "../../context/contestContext";
import { SellerContext } from "../../context/sellerContest";
import Pagination from "../components/pagination";
import Table from "../components/table";

export default function Serials() {
  const { sellectedSeller } = useContext(AppContext);
  const { select: selectSeller } = useContext(SellerContext);
  const { next, prev, page, count } = useContext(ContestContext);
  return (
    <div>
      <div className="flex items-center">
        {sellectedSeller && (
          <button
            onClick={() => selectSeller()}
            className="px-2 text-sm shadow-sm bg-gray-100 border border-gray-200 text-gray-800 rounded-full"
          >
            {sellectedSeller.name}
          </button>
        )}
      </div>
      <Table />
      <div className="mt-6">
        <Pagination next={next} prev={prev} page={page} count={count} />
      </div>
    </div>
  );
}
