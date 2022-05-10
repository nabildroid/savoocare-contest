import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import WellDoneImage from "../public/welldone.png";

import React, { Fragment, useEffect, useState } from "react";
import Particles from "./particles";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Thankyou({
  name,
  number,
}: {
  name: string;
  number: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
    <Particles />
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
            <div className="flex  min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="z-50 border-4 border-deeppurpel/25 z-50 flex-col-reverse md:flex-row  w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6  flex space-x-3 text-center align-middle shadow-xl transition-all">
                  <div className="w-52 mx-auto">
                    <Image src={WellDoneImage} />
                  </div>
                  <div className="space-y-2">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl  text-center font-bold leading-8 text-specialorange"
                    >
                      Thank you {name} 💛
                    </Dialog.Title>
                    <Dialog.Description className="">
                      you will receive a message on {number} for a confirmation
                    </Dialog.Description>
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
