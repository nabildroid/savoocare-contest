import React from "react";
import { useContext } from "react";
import { AppContext } from "./context";
import Home from "./views/home";
import Login from "./views/login";

export default function App() {
  const { authorized } = useContext(AppContext);

  if (authorized === undefined) {
    return <span>Loading ... </span>;
  }

  if (authorized === false) {
    return <Login />;
  }

  return <Home />;
}
