import { DatabaseIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import * as Server from "../../server";
import { AppContext } from "../../context";
import { useForm } from "react-hook-form";

function formatDate(d: Date) {
  return `${d.getFullYear()}-${d.getDay().toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

export default function Form() {
  const { isNew, selectedContest, selectContest, deleteContest } =
    useContext(AppContext);

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
  );
  const [file, setFile] = useState<FileList>();

  useEffect(() => {
    if (selectedContest && !isNew) {
      setTitle(selectedContest?.title ?? "");
      setTitleAr(selectedContest?.titleAr ?? "");
      setStartDate(selectedContest!.start);
      setEndDate(selectedContest!.end);
    }

    if (selectedContest && isNew) {
      setTitle("");
      setTitleAr("");
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90));
    }
  }, [selectedContest]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isNew) {
      if (!file) return;

      const contest = await Server.createContest(
        {
          end: endDate,
          start: startDate,
          title,
          titleAr,
          selled: 0,
          sellers: 0,
          total: 0,
          prizes: [],
        },
        file!
      );

      selectContest(contest);
    } else {
      await Server.updateContest(selectedContest!.id, {
        ...selectedContest!,
        end: endDate,
        start: startDate,
        title,
        titleAr,
      });
    }
  }

  return (
    <form onSubmit={onSubmit} method="POST">
      <div className=" sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="contest-title"
                className="block text-sm font-medium text-gray-700"
              >
                Contest Title
              </label>
              <div className="mt-1  flex flex-col space-y-2 lg:space-y-0 lg:space-x-4 lg:flex-row items-center rounded-md shadow-sm">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  name="contest-title"
                  id="contest-title"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-2 shadow-sm  mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="English"
                />
                <input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  type="text"
                  name="contest-title1"
                  id="contest-title1"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-2 shadow-sm  mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Arabic"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="start-day"
                className="block text-sm font-medium text-gray-700"
              >
                Start Day
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  value={formatDate(startDate!)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  type="date"
                  name="start-day"
                  id="start-day"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-2 shadow-sm  mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="end-day"
                className="block text-sm font-medium text-gray-700"
              >
                End Day
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  value={formatDate(endDate!)}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  type="date"
                  name="end-day"
                  id="end-day"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-2 shadow-sm  mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subscription Codes
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <DatabaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                  >
                    <span className={!isNew ? "text-gray-600" : ""}>
                      Upload a file
                    </span>
                    <input
                      disabled={!isNew}
                      onChange={(e) => setFile(e.target.files!)}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-x-2 bg-gray-50 text-right sm:px-6">
          <button
            onClick={deleteContest}
            className=" inline-flex hidden justify-center py-2 px-4  border-transparent shadow-sm text-sm font-medium rounded-md border border-red-500 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            delete
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
