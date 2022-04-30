

type Props = {
  next:()=>void,
  prev:()=>void,
}

export default function Pagination({next,prev}:Props) {
  return (
    <nav
      className="bg-white  py-3 flex items-center justify-between border-t border-gray-200 "
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
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
