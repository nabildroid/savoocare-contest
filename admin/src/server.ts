import { Code, Contest, Seller } from "./helpers/types";
import { Entity } from "./helpers/utils";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:3002/admin";

export async function getContests(): Promise<Contest[]> {
  console.log("fetching the contexts ...");
  const { data } = await axios.get<Contest[]>("contest");

  return data.map((d) => ({
    ...d,
    start: new Date(d.start),
    end: new Date(d.end),
  }));
}

export async function getSellers(
  page: number,
  query: {
    name?: string;
    serial?: string;
    type?: "unassigned";
  },
  sorted?: boolean
): Promise<Seller[]> {
  const { data } = await axios.get(
    `/sellers/${page}?name=${query.name ?? ""}&serial=${
      query.serial ?? ""
    }&type=${query.type ?? "unassigned"}`
  );

  return data as Seller[];
}

export async function updateContest(
  id: string,
  contest: Entity<Contest>
): Promise<void> {
  await axios.patch("/contest/" + id, {
    ...contest,
  });
}

export async function createContest(
  contest: Entity<Contest>,
  files: FileList
): Promise<Contest> {
  const formData = new FormData();

  formData.append("csv", files[0]);
  formData.append("title", contest.title);
  formData.append("titleAr", contest.titleAr);
  formData.append("start", contest.start.getTime().toString());
  formData.append("end", contest.end.getTime().toString());

  const { data } = await axios.post("/contest", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data as Contest;
}

export async function getCodes(
  contest: string,
  page: number,
  query: {
    sellers?: string[];
    serial?: string;
    type?: "selled" | "unassigned";
  },
  sorted?: boolean
): Promise<Code[]> {
  const { data } = await axios.get(
    `/codes/${contest}/${page}?serial=${query.serial ?? ""}&type=${
      query.type ?? "unassigned"
    }`
  );

  return data as Code[];
}

export async function assign(serial: string, seller: string): Promise<Boolean> {
  const { data } = await axios.post(`/sellers/assign/${seller}/${serial}`);
  return data == "ok";
}

export async function deleteCode(serial: string): Promise<void> {}
