import React from "react";
import { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContext } from "./context/appContext";
import AuthProvider from "./context/authContest";
import ContestProvider from "./context/contestContext";
import SellerProvider from "./context/sellerContest";
import Home from "./views/home";
import Login from "./views/login";


const queryClient = new QueryClient();


export default function App() {
  return (
    <AuthProvider login={<Login />}>
      <QueryClientProvider client={queryClient}>
        <SellerProvider>
          <ContestProvider>
            <Home />
          </ContestProvider>
        </SellerProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
