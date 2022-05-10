import {
  DatabaseIcon,
  SwitchVerticalIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import * as Server from "../../server";
import { useForm } from "react-hook-form";
import { AppContext } from "../../context/appContext";
import { ContestContext } from "../../context/contestContext";
import Country from "./country";
import { classNames } from "../../helpers/utils";

function formatDate(d: Date) {
  return `${d.getFullYear()}-${d.getDay().toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

export default function Form() {
  const { isNewContest } = useContext(AppContext);
  const { selected, select, newContest, updateContest } =
    useContext(ContestContext);

  const [countries, setCountries] = useState<number[]>([]);

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
  );
  const [file, setFile] = useState<FileList>();

  const [loading, setLoading] = useState(false);

  const [imgs, setImages] = useState<[FileList?, FileList?, FileList?]>([
    undefined,
    undefined,
    undefined,
  ]);

  useEffect(() => {
    if (selected && !isNewContest) {
      setTitle(selected?.title ?? "");
      setTitleAr(selected?.titleAr ?? "");
      setDesc(selected?.description ?? "");
      setStartDate(selected!.start);
      setEndDate(selected!.end);
      setCountries(selected.countries ?? []);
    }

    if (isNewContest) {
      setTitle("");
      setTitleAr("");
      setDesc("");
      setCountries([]);
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90));
    }
  }, [selected, isNewContest]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isNewContest) {
      if (!file || imgs.some((e) => !e)) return;

      await newContest(
        {
          end: endDate,
          start: startDate,
          title,
          titleAr,
          selled: 0,
          sellers: 0,
          total: 0,
          description: desc,
          completed: false,
          countries,
        },
        {
          csv: file,
          imgs: imgs as any,
        }
      );
    } else {
      await updateContest(
        {
          ...selected!,
          end: endDate,
          start: startDate,
          title,
          titleAr,
          description: desc,
          countries,
        },
        {
          csv: file,
          imgs: imgs.some((e) => !e) ? undefined : (imgs as any),
        }
      );
    }
  }

  return (
    <form onSubmit={onSubmit} method="POST">
      <div className=" sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="start-day"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Country
                  selected={213}
                  select={(c) => setCountries((ss) => [...new Set([c, ...ss])])}
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-3 flex-wrap">
            {countries.map((cn) => (
              <button
                type="button"
                onClick={() => setCountries((c) => c.filter((a) => a != cn))}
                className="px-2 hover:ring-2 ring-red-500 hover:bg-red-100 rounded-full font-mono text-orange-500 bg-orange-100 "
              >
                +{cn}
              </button>
            ))}
          </div>

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
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <textarea
                  id="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-2 shadow-sm  mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              {!isNewContest ? "New Batch Of" : ""} Subscription Codes
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <DatabaseIcon
                  className={classNames(
                    "mx-auto h-12 w-12 ",
                    !!file ? "text-orange-600" : "text-gray-400"
                  )}
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                  >
                    <span>Upload a file</span>
                    <input
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

          <div className="">
            <label
              htmlFor="contest-title"
              className="block text-sm font-medium text-gray-700"
            >
              Prizes
            </label>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-3  gap-2">
              {imgs.map((img, i) => (
                <div className="flex  justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PhotographIcon
                      className={classNames(
                        "mx-auto h-12 w-12 ",
                        !img ? "text-gray-400" : "text-orange-600"
                      )}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor={"image-prize-" + i}
                        className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span>Upload a Picture</span>
                        <input
                          onChange={(e) =>
                            setImages([
                              ...imgs.slice(0, i),
                              e.target.files!,
                              ...imgs.slice(i + 1),
                            ] as any)
                          }
                          id={"image-prize-" + i}
                          name={"image-prize-" + i}
                          type="file"
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-x-2 bg-gray-50 text-right sm:px-6">
          <button
            onClick={() => {}}
            className=" inline-flex hidden justify-center py-2 px-4  border-transparent shadow-sm text-sm font-medium rounded-md border border-red-500 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            delete
          </button>
          <button
            disabled={loading}
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {loading && (
              <SwitchVerticalIcon className="text-white animate-bounce w-4 h-4" />
            )}
            {!loading && "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
