import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import WellDoneImage from "../public/welldone.png";

import React, { Fragment, useEffect, useState } from "react";

const successParticels = {
  emitters: {
    position: {
      x: 50,
      y: 100,
    },
    rate: {
      quantity: 5,
      delay: 0.15,
    },
  },
  particles: {
    color: {
      value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
    },
    move: {
      decay: 0.05,
      direction: "top",
      enable: true,
      gravity: {
        enable: true,
      },
      outModes: {
        top: "none",
        default: "destroy",
      },
      speed: {
        min: 75,
        max: 150,
      },
    },
    number: {
      value: 0,
    },
    opacity: {
      value: 1,
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: "random",
      animation: {
        enable: true,
        speed: 30,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 30,
      },
    },
    size: {
      value: 3,
      animation: {
        enable: true,
        startValue: "min",
        count: 1,
        speed: 16,
        sync: true,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enlighten: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -7,
        max: 7,
      },
    },
    shape: {
      type: ["circle", "square"],
      options: {},
    },
  },
};

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
                <Dialog.Panel className=" border-4 border-deeppurpel/25 z-50 flex-col-reverse md:flex-row  w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6  flex space-x-3 text-center align-middle shadow-xl transition-all">
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
                      you will receive a message on 0{number} for a confirmation
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
