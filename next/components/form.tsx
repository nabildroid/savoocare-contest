import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";

import React, { Fragment, useState } from "react";
import Radio from "./radio";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Application = {
  name: string;
  tel: number;
  address: string;
  age: number;
  email: string;
  married?: boolean;
};

const isDev = process.env.NODE_ENV == "development";
const api = isDev ? "http://localhost:3002/api/check/" : "./check/";

async function apply(application: Application, code: string) {
  try {
    const response = await fetch(api + code, {
      method: "POST",
      body: JSON.stringify(application),
      headers: {
        "Content-type": "application/json",
      },
    });
    return (await response.text()) == "done";
  } catch (e) {
    // todo add logging system!
  }
}

export default function Form({
  code,
  setName,
  setNumber,
  countries,
}: {
  code: string;
  countries: number[];
  setName: (n: string) => void;
  setNumber: (n: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const [isMarried, setIsMarried] = useState<boolean>();
  const [country, setCountry] = useState<number>(countries[0]);

  function closeModal(name?: string, number?: number) {
    setIsOpen(false);
    if (name) {
      setName(name);
      setNumber(number!);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Application>();

  const onSubmit = async (data: any) => {
    await apply(
      {
        ...data,
        married: isMarried,
        tel: `+${country}-${data.tel}`,
      },
      code
    );
    closeModal(data.name, data.tel);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="  border-4 border-deeppurpel/25 z-50  w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-8 text-specialorange"
                  >
                    Please add your infromations!
                  </Dialog.Title>

                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-4">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full name{" "}
                        <span className="text-xs font-mono text-red-500  ">
                          *
                        </span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          {...register("name")}
                          type="text"
                          id="fullname"
                          autoComplete="name"
                          className={classNames(
                            "flex-1 p-2 text-gray-900 rounded-md focus:ring-2 outline-none focus:ring-specialorange  block w-full min-w-0  sm:text-sm border-gray-300",
                            errors.name ? "border-red-400" : ""
                          )}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="tel"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number{" "}
                        <span className="text-xs font-mono text-red-500  ">
                          *
                        </span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label htmlFor="country" className="sr-only">
                            Country
                          </label>
                          <select
                            onChange={(e) =>
                              setCountry(parseInt(e.target.value))
                            }
                            disabled={countries.length == 1}
                            id="country"
                            name="country"
                            className="focus:ring-orange-500 focus:border-orange-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                          >
                            {countries.map((c) => (
                              <option value={c} selected={country == c}>
                                +{c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          {...register("tel", {
                            required: true,
                            pattern: /0\d{9}/,
                          })}
                          type="tel"
                          id="tel"
                          autoComplete="tel"
                          className={classNames(
                            "flex-1 pl-24 p-2 text-gray-900 rounded-md focus:ring-2 outline-none focus:ring-specialorange  block w-full min-w-0  sm:text-sm border-gray-300",
                            errors.tel ? "border-red-400" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mail
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          autoComplete="email"
                          className={classNames(
                            "flex-1 p-2 text-gray-900 rounded-md focus:ring-2 outline-none focus:ring-specialorange  block w-full min-w-0  sm:text-sm border-gray-300",
                            errors.email ? "border-red-400" : ""
                          )}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age{" "}
                        <span className="text-xs font-mono text-red-500  ">
                          *
                        </span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          {...register("age", {
                            required: true,
                            max: 80,
                            min: 16,
                          })}
                          type="number"
                          id="age"
                          autoComplete="age"
                          className={classNames(
                            "flex-1 p-2 text-gray-900 rounded-md focus:ring-2 outline-none focus:ring-specialorange  block w-full min-w-0  sm:text-sm border-gray-300",
                            errors.age ? "border-red-400" : ""
                          )}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                        <span className="text-xs font-mono text-red-500  ">
                          *
                        </span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          {...register("address", { required: true })}
                          type="text"
                          id="address"
                          autoComplete="street-address"
                          className={classNames(
                            "flex-1 p-2 text-gray-900 rounded-md focus:ring-2 outline-none focus:ring-specialorange  block w-full min-w-0  sm:text-sm border-gray-300",
                            errors.address ? "border-red-400" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Married Status
                      </label>
                      <Radio select={setIsMarried} />
                    </div>

                    <div className="sm:col-span-6 text-center">
                      <input
                        type="submit"
                        className="w-full py-3 text-white uppercase bg-deeppurpel rounded-lg shadow-lg mx-auto"
                        value="Add Me"
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
