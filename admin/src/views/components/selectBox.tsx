import { Fragment, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon, PlusIcon } from "@heroicons/react/solid";
import { AppContext } from "../../context/appContext";
import { ContestContext } from "../../context/contestContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SelectBox: React.FC = ({}) => {
  const { setIsNewContest } = useContext(AppContext);
  const { select, selected, items } = useContext(ContestContext);

  const onClick = () => {
    console.log("new contest ....");
    setIsNewContest(true);
  };

  return (
    <div className="flex   items-center space-x-2">
      <button
        onClick={onClick}
        className="text-white hover:bg-orange-500 rounded-full p-1"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
      <Listbox value={selected ?? {}} onChange={select}>
        {({ open }) => (
          <div className="mt-1 w-full relative">
            <Listbox.Button className="relative w-full  border-2 border-white/50 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-200 sm:text-sm">
              <span
                className={classNames(
                  "block truncate text-orange-100 font-semibold",
                  !selected ? "opacity-0" : ""
                )}
              >
                {selected?.title ?? "default context"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-white/80"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-orange-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-8 pr-4"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {item.title}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-orange-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default SelectBox;
