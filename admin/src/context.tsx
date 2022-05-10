import React, { createContext, useContext, useEffect, useState } from "react";
import * as Server from "./server";
import { Code, Contest, Seller } from "./helpers/types";

type Props = {
  children?: React.ReactNode;
};

interface IAppProvider {
  authorized?: boolean;

  contests: Contest[];
  selectedContest?: Contest;
  selectContest(contest: Contest): void;
  deleteContest(): void;

  sellerPage: number;
  setSellerPage: (n: number) => void;
  sellers: Seller[];
  selectedSeller?: Seller;
  selectSeller(seller?: Seller): void;
  addSeller(name: string): Promise<boolean>;

  deleteCode(serial: string): void;
  codePage: number;
  setCodePage: (n: number) => void;
  assign(serial: string): void;
  codes: Code[];

  isNew: boolean;
  toggleNew(): void;
}

export const AppContext = createContext<IAppProvider>({} as any);

const AppProvider: React.FC<Props> = ({ children }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setContest] = useState<Contest>();

  const [sellerPage, setSellerPage] = useState(0);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSeller] = useState<Seller>();

  const [codePage, setCodePage] = useState(0);
  const [codes, setCodes] = useState<Code[]>([]);

  const [isNew, setIsNew] = useState<boolean>(false);

  const [authorized, setAuthorized] = useState<boolean>();

  useEffect(() => {
    // Server.subscribeToAuth(setAuthorized);
  }, []);

  useEffect(() => {
    Server.checkToken().then((isValide) => {
      console.log("checking ....");
      setAuthorized(isValide);
    });
  }, []);

  useEffect(() => {
    if (authorized) Server.getContests().then(setContests);
  }, [authorized]);

  useEffect(() => {
    if (authorized) Server.getSellers(sellerPage, {}).then(setSellers);
  }, [sellerPage, authorized]);

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
    if (selectedContest && contests.every((s) => s.id != selectedContest?.id)) {
      setContests((c) => [selectedContest, ...c]);
    }

    setSeller(undefined);
  }, [selectedContest]);

  useEffect(() => {
    if (selectedContest && authorized) {
      Server.getCodes(selectedContest.id, codePage, {}).then(setCodes);
    }
  }, [selectedContest, codePage, authorized]);

  const assign = async (serial: string) => {
    if (!selectedSeller) return;
    await Server.assign(serial, selectedSeller.name);
    setCodes((codes) =>
      codes.map((c) => {
        if (c.serial == serial) c.seller = selectedSeller.name;
        return c;
      })
    );
  };

  async function addSeller(name: string) {
    try {
      const seller = await Server.createSeller(name);
      if (!seller?.name) return false;
      if (seller.name) {
        setSellers((s) => [seller, ...sellers]);
        return true;
      }
    } catch (e) {}

    return false;
  }

  async function deleteContest() {
    if (selectedContest) {
      await Server.deleteCode(selectedContest?.id);
      setContests((s) => s.filter((i) => i.id != selectedContest.id));
      setContest(undefined);
    }
  }

  async function deleteCode(serial: string) {
    await Server.deleteCode(serial);
    setCodes((c) => c.filter((a) => a.serial != serial));
  }

  const values: IAppProvider = {
    deleteCode,
    deleteContest,
    sellerPage,
    setSellerPage,
    contests,
    addSeller,
    codes,
    assign,
    authorized,
    sellers,
    selectContest: setContest,
    selectSeller: setSeller,
    selectedContest,
    selectedSeller,
    isNew,
    codePage,
    setCodePage,
    toggleNew: () => setIsNew((s) => !s),
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
