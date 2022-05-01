import { useContext, useState } from "react";
import { AppContext } from "../../context";
import AddSeller from "../components/addSeller";
import Pagination from "../components/pagination";

export default function Sellers() {
  const { sellers, selectSeller, sellerPage, setSellerPage } =
    useContext(AppContext);

  const [showNewSeller, setShowNewSeller] = useState(false);

  return (
    <div>
      {showNewSeller && <AddSeller hide={() => setShowNewSeller(false)} />}

      <button
        onClick={() => setShowNewSeller(true)}
        className="mx-auto test-sm p-1 w-full hover:bg-orange-500 hover:text-white text-orange-800 border border-orange-500 rounded-lg"
      >
        add seller
      </button>

      <div className="flow-root mt-6">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {sellers.map((person) => (
            <li key={person.name} className="py-2">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {person.name}
                  </p>
                  <div className="text-xs flex space-x-2 items-center text-gray-500 truncate">
                    <span className="px-1 rounded-full text-gray-600 bg-gray-100">
                      {person.products} item
                    </span>
                    {!!person.selled && (
                      <span className="px-1 rounded-full text-green-700 bg-green-100">
                        {person.selled} sold
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => selectSeller(person)}
                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
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
        <Pagination
          next={() => setSellerPage(sellerPage + 1)}
          prev={() => setSellerPage(sellerPage - 1)}
        />
      </div>
    </div>
  );
}
