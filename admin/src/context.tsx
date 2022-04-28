import React, { createContext, useContext, useEffect, useState } from "react";
import * as Server from "./server";
import { Code, Contest, Seller } from "./helpers/types";

type Props = {
  children?: React.ReactNode;
};

interface IAppProvider {
  login(name: string, password: string): Promise<boolean>;
  authorized?: boolean;

  contests: Contest[];
  selectedContest?: Contest;
  selectContest(contest: Contest): void;

  sellers: Seller[];
  selectedSeller?: Seller;
  selectSeller(seller?: Seller): void;

  codes: Code[];

  isNew: boolean;
  toggleNew(): void;
}
export const AppContext = createContext<IAppProvider>({} as any);

async function checkToken(token: string) {
  // todo return false immeditatly when the token is empty
  return true;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setContest] = useState<Contest>();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSeller] = useState<Seller>();

  const [codes, setCodes] = useState<Code[]>([]);

  const [isNew, setIsNew] = useState<boolean>(false);

  const [authorized, setAuthorized] = useState<boolean>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkToken(token ?? "").then((isValide) => {
      setAuthorized(isValide);
    });
  }, []);

  useEffect(() => {
    Server.getContests().then(setContests);
    Server.getSellers(0, {}).then(setSellers);
    Server.getCodes(0, {}).then(setCodes);
  }, []);

  useEffect(() => {
    if (!selectedContest && contests.length) {
      const filtredContests = [
        ...contests.filter((c) => c.end > new Date()),
        contests[0],
      ];
      setContest(filtredContests[0]);
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
    codes,
    authorized,
    sellers,
    login,
    selectContest: setContest,
    selectSeller: setSeller,
    selectedContest,
    selectedSeller,
    isNew,
    toggleNew: () => setIsNew((s) => !s),
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
