import { useContext, useLayoutEffect, useRef, useState } from "react";
import { AppContext } from "../../context";
import { ContestContext } from "../../context/contestContext";
import { SellerContext } from "../../context/sellerContest";
import { Code } from "../../helpers/types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Table() {
  const { selected: sellectedSeller } = useContext(SellerContext);
  const { codes, assignToSeller, deleteCode, selected } =
    useContext(ContestContext);

  

  
  const checkbox = useRef<HTMLInputElement>(null!);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Code[]>([]);


  function assignAll() {
    selectedPeople.forEach((code) => {
      assignToSeller(code.serial);
    });
  }

  function deleteAll() {
    if (
      confirm(`removing all the ${codes.length} codes from ${selected?.title}`)
    ) {
      selectedPeople.forEach((code) => {
        deleteCode(code.serial);
      });
    }
  }
  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < codes.length;
    setChecked(selectedPeople.length === codes.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedPeople, codes]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : (codes as any));
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function removeSerial(serial: string) {
    if (confirm(`removing "${serial}" code from ${selected?.title}`)) {
      deleteCode(serial);
    }
  }

  return (
    <div className="sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2  overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden  ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {selectedPeople.length > 0 && (
                <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                  {sellectedSeller && (
                    <button
                      type="button"
                      onClick={assignAll}
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      assign to {sellectedSeller.name}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={deleteAll}
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full  divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="hidden lg:table-cell relative w-12 px-6 sm:w-16 sm:px-8"
                    >
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="lg:min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Serial code
                    </th>
                    <th
                      scope="col"
                      className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Seller
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {codes.map((person) => (
                    <tr
                      key={person.serial}
                      className={
                        selectedPeople.includes(person)
                          ? "bg-gray-50"
                          : undefined
                      }
                    >
                      <td className="hidden lg:table-cell relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedPeople.includes(person) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={person.serial}
                          checked={selectedPeople.includes(person)}
                          onChange={(e) =>
                            setSelectedPeople(
                              e.target.checked
                                ? [...selectedPeople, person]
                                : selectedPeople.filter((p) => p !== person)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap font-mono py-4 pr-3 text-sm font-medium",
                          selectedPeople.includes(person)
                            ? "text-indigo-600"
                            : "text-gray-900"
                        )}
                      >
                        {person.serial.toUpperCase()}
                      </td>
                      <td className="hidden lg:table-cell  whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={classNames(
                            "inline-bloc -ml-2  rounded-full px-2 py-1 text-xs font-bold ",
                            person.selled
                              ? "text-green-700 bg-green-100"
                              : "text-gray-700 bg-gray-100"
                          )}
                        >
                          {person.selled ? "activated" : "open"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                        <button
                          disabled={!sellectedSeller}
                          onClick={() => assignToSeller(person.serial)}
                          className={classNames(
                            "border-b",
                            person.seller
                              ? "border-green-500"
                              : "border-orange-500"
                          )}
                        >
                          {person.seller ?? "####"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => removeSerial(person.serial)}
                          className="text-red-600 hover:text-red-900"
                        >
                          delete
                          <span className="sr-only">
                            delete the serial, {person.serial}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
