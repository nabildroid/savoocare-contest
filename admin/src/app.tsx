import React from "react";
import { useContext } from "react";
import { AppContext } from "./context";
import Home from "./views/home";
import Login from "./views/login";

export default function App() {
  const { authorized } = useContext(AppContext);

  console.log(authorized);

  if (authorized === false) {
    return <Login />;
  }

  if (authorized === undefined) {
    return <span>Loading ... </span>;
  }


  return <Home />;
}
