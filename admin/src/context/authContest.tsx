import React, { createContext, useContext, useEffect, useState } from "react";
import { Http } from "../main";
import { AppContext, IAppProvider } from "./appContext";

const key = "token";
let interceptorId: number;

function load(): string | undefined {
  const data = localStorage.getItem(key);
  if (data?.length) return data;
}

function save(str: string) {
  if (!str.length) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, str);
  }
}

function enjectToken(token: string) {
  save(token);
  interceptorId = Http.interceptors.request.use((config) => {
    if (!config.headers) config.headers = {};

    config.headers.authorization = token;

    return config;
  });
}

function throwToken() {
  if (interceptorId) {
    Http.interceptors.request.eject(interceptorId);
  }
  save("");
  window.location.reload();
}

function loadToken() {
  const token = load();
  console.log("previous token", token);

  if (token) {
    enjectToken(token);
    return true;
  }
  return false;
}

async function Login(name: string, password: string) {
  const { data } = await Http.post("../auth/login", { name, password });

  if (data.token) {
    enjectToken(data.token);
    return true;
  }

  return false;
}

type Props = {
  children?: React.ReactNode;
  login: React.ReactNode;
};

interface IAuthProvider {
  username: string;
  setUsername: (s: string) => void;
  password: string;
  setPassword: (s: string) => void;
  loading: boolean;
  success: boolean;
  error: boolean;
  submit: (e: React.SyntheticEvent) => void;
}

export const AuthContext = createContext<IAuthProvider>({
  setPassword: (p: string) => {},
  setUsername: (p: string) => {},
  username: "",
  password: "",
  loading: false,
} as any);

const AuthProvider: React.FC<Props> = ({ children, login }) => {
  const { setAuth, authorized } = useContext(AppContext);

  useEffect(() => setAuth(loadToken()), []);

  useEffect(() => {
    Http.interceptors.response.use(
      (e) => e,
      (e) => {
        setAuth(false);
        throwToken();
        return Promise.reject(e);
      }
    );
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(true);
    } else {
      setLoading(true);
      try {
        const status = await Login(username, password);

        if (status) {
          setSuccess(true);

          setTimeout(() => {
            setAuth(true);
          }, 1000);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    }

    setTimeout(() => {
      setError(false);
      setSuccess(false);
    }, 700);
  };

  const values: IAuthProvider = {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    submit,
    success,
  };

  if (!authorized || authorized === null) {
    return <AuthContext.Provider value={values}>{login}</AuthContext.Provider>;
  } else {
    console.log("auth enable contest");
    return (
      <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
  }
};

export default AuthProvider;
