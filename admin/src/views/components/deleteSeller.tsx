import { Dialog, Transition } from "@headlessui/react";
import { DownloadIcon } from "@heroicons/react/outline";
import { Fragment, useContext, useState } from "react";
import { AppContext } from "../../context";
import { ContestContext } from "../../context/contestContext";
import { SellerContext } from "../../context/sellerContest";

export default function DeleteSeller({
  response,
  name,
}: {
  response: (v: boolean) => void;
  name: string;
}) {
  const { downloadContest } = useContext(ContestContext);

  async function download() {
    const url = await downloadContest(name);
    window.open(url, "_blank");
  }

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => response(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-orange-900"
                  >
                    Delete {name}
                  </Dialog.Title>
                  <div className="mt-2">
                    <button
                      onClick={download}
                      className="flex space-x-2 hover:bg-orange-200 mx-auto shadow-inner items-center justify-center text-orange-700 px-12 py-3 rounded-md border-2 border-orange-300"
                    >
                      <DownloadIcon className="w-4 h-4 opacity-60" />
                      <span>Download {name} Codes</span>
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="ml-2 focus:outline-none inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                      onClick={() => response(true)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="focus:outline-none inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                      onClick={() => response(false)}
                    >
                      Cancel
                    </button>
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
