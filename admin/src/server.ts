import { Code, Contest, Seller } from "./helpers/types";

export async function getContests(): Promise<Contest[]> {
  return [];
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
  return [];
}

export async function updateContest(
  id: string,
  contest: Omit<Contest, "id">
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
  return [];
}

export async function assign(contest: string, seller: string): Promise<Code> {
  return null!;
}

export async function deleteCode(serial: string): Promise<void> {}
