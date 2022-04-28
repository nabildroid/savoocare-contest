import React, { useContext, useState } from "react";
import { AppContext } from "../context";

const Login: React.FC = ({}) => {
  const { login } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    login(username, password).then((result) => {
      if (result) {
        setSuccess(true);
      } else {
        setError(true);
        setLoading(false);
        setPassword("");
        setUsername("");
        setTimeout(() => setError(false), 3000);
      }
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="mx-auto rounded max-w-lg p-4 shadow bg-white">
        <h1 className="text-center font-bold text-lg  text-indigo-600 ">
          Login
        </h1>
        <form onSubmit={submit}>
          <div>
            <label className="text-gray-600 text-sm">Username</label>

            <input
              className="block bg-gray-100 rounded-md p-1 ring-1 ring-indigo-400"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label className="text-gray-600 text-sm">password</label>

            <input
              className="block bg-gray-100 rounded-md p-1 ring-1 ring-indigo-400"
              name="username"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mx-auto block p-2 w-full mt-4 text-white ${
              success ? "bg-green-500" : error ? "bg-red-500" : "bg-indigo-500"
            } rounded-sm`}
          >
            {!loading && <span>Login</span>}
            {loading && <span>...</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
