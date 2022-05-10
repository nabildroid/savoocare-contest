import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Seller } from "../helpers/types";
import { Http } from "../main";
import { AppContext } from "./appContext";

export async function createSeller(name: string) {
  const { data } = await Http.post("/seller", {
    name,
  });

  return data as Seller;
}

async function getSellers(
  page: number,
  query: {
    max?: number;
    name?: string;
    serial?: string;
    type?: "unassigned";
  }
) {
  const { data } = await Http.get(
    `/sellers/${page}?name=${query.name ?? ""}&max=${query.max ?? 10}&serial=${
      query.serial ?? ""
    }&type=${query.type ?? "unassigned"}`
  );

  return data as { count: number; data: Seller[] };
}

async function Assign(serial: string, seller: string): Promise<Boolean> {
  const { data } = await Http.post(`/sellers/assign/${seller}/${serial}`);
  return data == "ok";
}

type Props = {
  children?: React.ReactNode;
};

interface ISellerProvider {
  assign: (serial: string) => Promise<boolean>;
  add: (name: string) => void;

  items: Seller[];
  selected?: Seller;

  select(seller?: Seller): void;
  next: () => void;
  prev: () => void;
  page: number;
  count: number;
  setSearch: (str: string) => void;
  search: string;
}

export const SellerContext = createContext<ISellerProvider>({
  items: [],
  selected: undefined,
  page: 0,
  search: "",
  count: 0,
} as any);

const SellerProvider: React.FC<Props> = ({ children }) => {
  const { pageCount, setSeller, sellectedSeller } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selected, select] = useState<Seller>();
  const [items, setItems] = useState<Seller[]>([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);

  const query = useQuery(
    ["getSellers", page, pageCount],
    () => {
      return getSellers(page, {
        max: pageCount,
      });
    },
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    const { data } = query;

    if (data) {
      setItems(data.data ?? []);
      setCount(data.count ?? []);
      if (!data.data.length) {
        setPage(Math.max(0, page - 1));
      }
    }
  }, [query.data]);

  useEffect(() => {
    setSeller(selected);
  }, [selected]);

  function next() {
    setPage((p) => p + 1);
  }
  function prev() {
    setPage((p) => Math.max(p - 1, 0));
  }

  async function assign(serial: string) {
    const result = await Assign(serial, selected!.name);
    if (result) {
      setItems((items) =>
        items.map((i) => {
          if (i.name == selected?.name) {
            i.products++;
          }
          return i;
        })
      );
      return true;
    }
    return false;
  }
  async function add(name: string) {
    const seller = await createSeller(name);
    setItems((i) => [seller, ...i]);
  }

  const values: ISellerProvider = {
    add,
    assign,
    next,
    prev,
    page,
    count,
    search,
    setSearch,
    select,
    selected,
    items,
  };

  return (
    <SellerContext.Provider value={values}>{children}</SellerContext.Provider>
  );
};

export default SellerProvider;
