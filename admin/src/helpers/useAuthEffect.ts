import { useCallback, useEffect } from "react";

const useAuthEffect = (
  fnc: () => any,
  dependecies: any[],
  setAuth: (v: any) => void
) => {
  const exc = useCallback(async () => {
    try {
      fnc();
    } catch (e) {
      setAuth(false);
    }
  }, [setAuth, fnc]);

  useEffect(() => {
    exc();
  }, [...dependecies, exc]);

  return null;
};

export default useAuthEffect;
