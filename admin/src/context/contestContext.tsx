import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Code, Contest } from "../helpers/types";
import { Entity } from "../helpers/utils";
import { Http } from "../main";
import { AppContext, IAppProvider } from "./appContext";
import { SellerContext } from "./sellerContest";

type ContestFiles = {
  csv: FileList;
  imgs: [FileList, FileList, FileList];
};

export async function Download(id: string) {
  const { data } = await Http.get(`/contest/${id}/applications`);
  const root = import.meta.env.PROD ? "/admin/" : "file:///tmp/";
  return `${root}${data}` as string;
}

export async function UpdateContest(
  id: string,
  contest: Entity<Contest>,
  files: Partial<ContestFiles>
): Promise<void> {
  const formData = new FormData();

  if (files.csv) formData.append("csv", files.csv[0]);
  if (files.imgs) formData.append("prize1", files.imgs[0][0]);
  if (files.imgs) formData.append("prize2", files.imgs[1][0]);
  if (files.imgs) formData.append("prize3", files.imgs[2][0]);
  formData.append("title", contest.title);
  formData.append("titleAr", contest.titleAr);
  formData.append("start", contest.start.getTime().toString());
  formData.append("end", contest.end.getTime().toString());
  formData.append("description", contest.description);
  formData.append("countries", contest.countries.filter(Boolean).join(","));

  await Http.patch("/contest/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function CreateContest(
  contest: Entity<Contest>,
  files: ContestFiles
): Promise<Contest> {
  const formData = new FormData();

  formData.append("csv", files.csv[0]);
  formData.append("prize1", files.imgs[0][0]);
  formData.append("prize2", files.imgs[1][0]);
  formData.append("prize3", files.imgs[2][0]);
  formData.append("title", contest.title);
  formData.append("titleAr", contest.titleAr);
  formData.append("start", contest.start.getTime().toString());
  formData.append("end", contest.end.getTime().toString());
  formData.append("description", contest.description);
  formData.append("countries", contest.countries.filter(Boolean).join(","));

  const { data } = await Http.post("/contest", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data as Contest;
}

export async function DeleteCode(serial: string): Promise<void> {
  const { data } = await Http.delete("/code/" + serial);
}

async function getContests(): Promise<Contest[]> {
  console.log("fetching the contexts ...");
  const { data } = await Http.get<Contest[]>("contest");

  return data.map((d) => ({
    ...d,
    start: new Date(d.start),
    end: new Date(d.end),
    countries: (d.countries as any as string)
      .split(",")
      .map((e) => parseInt(e))
      .filter(Boolean),
  }));
}

export async function getCodes(
  contest: string,
  page: number,
  query: {
    max?: number;
    seller?: string;
    serial?: string;
    type?: "selled" | "unassigned";
  },
  sorted?: boolean
) {
  const { data } = await Http.get(
    `/codes/${contest}/${page}?serial=${query.serial ?? ""}&seller=${
      query.seller ?? ""
    }&max=${query.max ?? 10}&type=${query.type ?? "unassigned"}`
  );

  return data as { count: number; data: Code[] };
}

type Props = {
  children?: React.ReactNode;
};

interface IContestProvider {
  items: Contest[];
  selected?: Contest;
  select(contest: Contest): void;

  codes: Code[];
  next: () => void;
  prev: () => void;
  page: number;
  count: number;
  setSearch: (str: string) => void;
  search: string;

  assignToSeller(serial: string): void;
  deleteCode(serial: string): void;

  updateContest(
    contest: Entity<Contest>,
    files: Partial<ContestFiles>
  ): Promise<void>;
  newContest(contest: Entity<Contest>, files: ContestFiles): Promise<void>;
  downloadContest(): Promise<string>;
}

export const ContestContext = createContext<IContestProvider>({
  codes: [],
  count: 0,
  items: [],
  page: 0,
  search: "",
} as any);

const ContestProvider: React.FC<Props> = ({ children }) => {
  const { selected: selectedSeller, assign } = useContext(SellerContext);
  const app = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selected, select] = useState<Contest>();
  const [items, setItems] = useState<Contest[]>([]);

  const [codes, setCodes] = useState<Code[]>([]);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(0);

  console.log([selected?.id, selectedSeller?.name, page, app.pageCount]);
  const query = useQuery(
    ["getCodes", selected?.id, selectedSeller?.name, page, app.pageCount],
    () => {
      return getCodes(selected!.id, page, {
        max: app.pageCount,
        seller: selectedSeller?.name,
      });
    },
    {
      enabled: !!selected,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const { data } = query;
    console.log("queired");
    if (data) {
      setCodes(data.data ?? []);
      setCount(data.count ?? []);
      if (!data.data.length) {
        setPage(Math.max(0, page - 1));
      }
    }
  }, [query.data]);

  useEffect(() => {
    setCodes([]);
    app.setInnerLoading(true);
    app.setInnerLoading(false);
  }, [selected]);

  useEffect(() => {
    console.log("creating contest");
    getContests().then(setItems);
  }, []);

  useEffect(() => {
    if (items.length) {
      select(items[items.length - 1]);
    }
  }, [items]);

  useEffect(() => {
    setPage(0);
  }, [selectedSeller]);

  function next() {
    setPage((p) => p + 1);
  }
  function prev() {
    setPage((p) => Math.max(p - 1, 0));
  }

  async function assignToSeller(serial: string) {
    if (await assign(serial)) {
      setCodes((codes) =>
        codes.map((c) => {
          if (c.serial == serial) {
            c.seller = app.sellectedSeller?.name;
          }
          return c;
        })
      );
    }
  }

  async function deleteCode(serial: string) {
    await DeleteCode(serial);
    setCodes(codes.filter((i) => i.serial != serial));
  }

  async function updateContest(
    contest: Entity<Contest>,
    files: Partial<ContestFiles>
  ) {
    if (!selected?.id) return;

    await UpdateContest(selected.id, contest, files);
    select({
      ...selected,
      ...contest,
    });
  }

  async function newContest(contest: Entity<Contest>, files: ContestFiles) {
    const newCont = await CreateContest(contest, files);
    setItems((i) => [newCont, ...i]);

    select(newCont);
    app.setIsNewContest(false);
  }

  async function downloadContest() {
    const id = selected!.id;
    const url = await Download(id);
    return url;
  }

  const values: IContestProvider = {
    newContest,
    updateContest,
    next,
    page,
    prev,
    count,
    codes,
    search,
    setSearch,
    deleteCode,
    select,
    assignToSeller,
    selected,
    items,
    downloadContest,
  };

  return (
    <ContestContext.Provider value={values}>{children}</ContestContext.Provider>
  );
};

export default ContestProvider;
