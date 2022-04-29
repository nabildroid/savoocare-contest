import { Code, Contest, Seller } from "./helpers/types";
import { Entity } from "./helpers/utils";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/admin";

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
  return [
    {
      name: "Lakrib Nabil",
      products: 356,
      selled: 15,
    },
    {
      name: "Savoo care",
      products: 3506,
      selled: 0,
    },
    {
      name: "sellerA",
      products: 356,
      selled: 256,
    },
  ];
}

export async function updateContest(
  id: string,
  contest: Entity<Contest>
): Promise<Contest> {
  return null!;
}

export async function getCodes(
  page: number,
  query: {
    sellers?: string[];
    serial?: string;
    type?: "selled" | "unassigned";
  },
  sorted?: boolean
): Promise<Code[]> {
  return [
    {
      serial: "dsd87s7d8sd8",
      selled: false,
    },
    {
      serial: "dsd87s7d8sd8",
      selled: true,
    },
    {
      serial: "dsd87s7d8sd8",
      selled: false,
      seller: "lakrib nabil",
    },
    {
      serial: "dsd87s7d8sd8",
      selled: false,
    },
    {
      serial: "dsd87s7d8sd8",
      selled: false,
    },
  ];
}

export async function assign(contest: string, seller: string): Promise<Code> {
  return null!;
}

export async function deleteCode(serial: string): Promise<void> {}
