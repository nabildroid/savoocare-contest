import { useContext, useState } from "react";
import { SellerContext } from "../../context/sellerContest";
import { classNames } from "../../helpers/utils";
import AddSeller from "../components/addSeller";
import DeleteSeller from "../components/deleteSeller";
import Pagination from "../components/pagination";

export default function Sellers() {
  const { items, selected, select, next, prev, page, remove, count } =
    useContext(SellerContext);

  const [showNewSeller, setShowNewSeller] = useState(false);

  const [deleteSellerName, setDeleteSellerName] = useState("");

  const deleterResponse = (d: boolean) => {
    if (d) {
      remove(deleteSellerName);
    }

    setDeleteSellerName("");
  };

  return (
    <div>
      {showNewSeller && <AddSeller hide={() => setShowNewSeller(false)} />}
      {!!deleteSellerName && (
        <DeleteSeller name={deleteSellerName} response={deleterResponse} />
      )}

      <button
        onClick={() => setShowNewSeller(true)}
        className="mx-auto test-sm p-1 w-full hover:bg-orange-500 hover:text-white text-orange-800 border border-orange-500 rounded-lg"
      >
        add seller
      </button>

      <div className="flow-root mt-6 ">
        <ul
          role="list"
          className="-my-5 divide-y divide-gray-200 max-h-[500px] overflow-y-auto"
        >
          {items.map((item) => (
            <li key={item.name} className="py-2">
              <div className="group flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <div className="text-xs flex space-x-2 items-center text-gray-500 truncate">
                    <span className="px-1 rounded-full text-gray-600 bg-gray-100">
                      {item.products} item
                    </span>
                    {!!item.selled && (
                      <span className="px-1 rounded-full text-green-700 bg-green-100">
                        {item.selled} sold
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button onClick={()=>setDeleteSellerName(item.name)} className="text-sm inline-block sm:hidden  group-hover:inline-block  text-red-500 px-2 pr-3 hover:bg-red-50">
                    delete
                  </button>
                  <button
                    onClick={() => select(item)}
                    className={classNames(
                      "inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50",
                      item.name == selected?.name
                        ? "bg-orange-500 text-white"
                        : ""
                    )}
                  >
                    select
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Pagination next={next} prev={prev} page={page} count={count} />
      </div>
    </div>
  );
}
