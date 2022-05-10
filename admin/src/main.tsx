import React from "react";
import Axios from "axios";
import ReactDOM from "react-dom/client";
import App from "./app";
import AppProvider from "./context/appContext";
import "./helpers/index.css";

const devServer = "http://localhost:3002";
const baseURL = import.meta.env.DEV ? devServer + "/admin" : "./api";

export const Http = Axios.create({ baseURL });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
