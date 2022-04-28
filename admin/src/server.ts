import { Code, Contest, Seller } from "./helpers/types";
import { Entity } from "./helpers/utils";

export async function getContests(): Promise<Contest[]> {
  return [
    {
      end: new Date(),
      start: new Date(),
      id: "dsdsddsdsd",
      prizes: [],
      selled: 100,
      sellers: 53,
      title: "lenses contest",
      titleAr: "lenses contest",
      total: 750,
    },

    {
      end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      start: new Date(),
      id: "dsdsddsdsd",
      prizes: [],
      selled: 100,
      sellers: 70,
      title: "labtops contest",
      titleAr: "labtops contest",
      total: 350,
    },
  ];
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
      id: "dsdsdsdsd",
      name: "Lakrib Nabil",
      products: 356,
      selled: 15,
    },
    {
      id: "dsdsdsds688d",
      name: "Savoo care",
      products: 3506,
      selled: 0,
    },
    {
      id: "dsdsdsdszdedzd",
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
