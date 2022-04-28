import React, { createContext, useContext, useEffect, useState } from "react";
import * as Server from "./server";
import { Contest, Seller } from "./helpers/types";

type Props = {
  children?: React.ReactNode;
};

interface IAppProvider {
  login(name: string, password: string): Promise<boolean>;
  authorized?: boolean;

  contests: Contest[];
  selectedContest?: Contest;
  selectContest(contest: Contest): void;

  selectedSeller?: Seller;
  selectSeller(seller?: Seller): void;
}
export const AppContext = createContext<IAppProvider>({} as any);

async function checkToken(token: string) {
  // todo return false immeditatly when the token is empty
  return false;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setContest] = useState<Contest>();

  const [selectedSeller, setSeller] = useState<Seller>();

  const [authorized, setAuthorized] = useState<boolean>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkToken(token ?? "").then((isValide) => {
      setAuthorized(isValide);
    });
  }, []);

  useEffect(() => {
    Server.getContests().then(setContests);
  }, []);

  useEffect(() => {
    if (!selectedContest && contests.length) {
      setContest(contests[0]);
    }
  }, [contests]);

  useEffect(() => {
    setSeller(undefined);
  }, [selectedContest]);

  const login = async (name: string, password: string) => {
    setTimeout(() => setAuthorized(true), 2000);
    return true;
  };

  const values: IAppProvider = {
    contests,
    authorized,
    login,
    selectContest: setContest,
    selectSeller: setSeller,
    selectedContest,
    selectedSeller,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
