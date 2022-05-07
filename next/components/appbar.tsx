import React from "react";
import Image from "next/image";
import Logo from "../public/logo.png";
export default function AppBar() {
  return (
    <nav
      aria-label="Global"
      className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 flex-none relative z-50 text-sm leading-6 font-medium text-gray-200 pt-5"
    >
      <div className="flex items-center justify-between">
        <a href="https://savoocare.com/" className="relative flex-none h-14 aspect-video text-white">
          <Image src={Logo} alt="Savoo care" layout="responsive" priority />
        </a>

        <div className="">
          <a
            href="https://savoocare.com"
            className="group pl-6 border-gray-700 hover:text-specialorange flex items-center"
          >
            our store
            <svg
              aria-hidden="true"
              width="11"
              height="10"
              fill="none"
              className="flex-none ml-1.5 text-gray-400 group-hover:text-specialorange"
            >
              <path
                d="M5.593 9.638L10.232 5 5.593.36l-.895.89 3.107 3.103H0v1.292h7.805L4.698 8.754l.895.884z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
