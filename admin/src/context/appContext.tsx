import React, { createContext, useContext, useEffect, useState } from "react";
import { Seller } from "../helpers/types";

type Props = {
  children?: React.ReactNode;
};

export enum Page {
  info = "Home",
  codes = "Serial Codes",
  settings = "Settings",
}

type PageCount = number;

export interface IAppProvider {
  authorized: boolean;
  setAuth: (b: boolean) => void;
  innerLoading: boolean;
  setInnerLoading: (b: boolean) => void;

  sellectedSeller?: Seller;
  setSeller: (s?: Seller) => void;

  pageCount: PageCount;
  setPageCount(count: PageCount): void;

  isNewContest: boolean;
  setIsNewContest(b: boolean): void;

  section: Page;
  setSection: (p: Page) => void;

  searchSeller: string;
  setSearchSeller: (str: string) => void;
}

export const AppContext = createContext<IAppProvider>(null!);

const AppProvider: React.FC<Props> = ({ children }) => {
  const [authorized, setAuth] = useState<boolean>(null!);
  const [sellectedSeller, setSeller] = useState<Seller>();
  const [searchSeller, setSearchSeller] = useState("");
  const [pageCount, setPageCount] = useState<PageCount>(10);
  const [innerLoading, setInnerLoading] = useState(false);

  const [isNewContest, setIsNewContest] = useState(false);
  const [section, setSection] = useState<Page>(Page.info);

  useEffect(() => {
    if (section != Page.settings) setIsNewContest(false);
  }, [section]);

  useEffect(() => {
    if (isNewContest) setSection(Page.settings);
  }, [isNewContest]);

  const values: IAppProvider = {
    authorized,
    setAuth,

    sellectedSeller,
    setSeller,

    setSearchSeller,
    searchSeller,

    pageCount,
    setPageCount,

    innerLoading,
    setInnerLoading,

    isNewContest,
    setIsNewContest,

    section,
    setSection,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
