import { useContext } from "react";
import { AppContext } from "../../context/appContext";

type Props = {
  next: () => void;
  prev: () => void;
  page: number;
  count: number;
};

export default function Pagination({ next, prev, page, count }: Props) {
  const { setPageCount, pageCount } = useContext(AppContext);
  return (
    <nav
      className="bg-white  py-3 flex items-center justify-between border-t border-gray-200 "
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{page * pageCount}</span> to
          <span className="font-medium">{(page + 1) * pageCount}</span> of
          <span className="font-medium"> {count}</span> results
        </p>
        <select
          value={pageCount}
          onChange={(e) => setPageCount(parseInt(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={100}>100</option>
          <option value={1000}>1000</option>
        </select>
      </div>

      <div className="flex-1 text-sm flex justify-between sm:justify-end">
        <button
          onClick={prev}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={next}
          className="ml-3 relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
