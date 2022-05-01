import React, { useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function checkCode(code: string) {
  try {
    const response = await fetch("./check/" + code);
    return (await response.text()) == "valide";
  } catch (e) {
    // todo add logging system!
  }
}

const isSubscriptionCode = (x: string) =>
  (x.match(/\d{3}(\d|[A-F]){5}/) ?? [])[0] == x;

type Props = {
  setValideCode: (str: string) => void;
};

const Action: React.FC<Props> = ({ setValideCode }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValide, setIsValide] = useState(false);
  const [isError, setIsError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubscriptionCode(code)) {
      // todo force code length
      setLoading(true);
      const codeIsValide = await checkCode(code);

      if (codeIsValide) {
        setIsValide(true);
        setValideCode(code);
      } else {
        setCode("");
        setIsError(true);
        setIsValide(false);
      }

      setLoading(false);
    } else {
      setIsError(true);
    }

    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }
  return (
    <form
      onSubmit={submit}
      className="order-2 w-full text-center grid grid-cols-1 gap-3 sm:flex sm:gap-0 sm:space-x-6"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={classNames(
          "outline-none py-2 px-3 text-deeppurpel font-bold rounded-lg text-sm shadow-lg shadow-specialorange/20 bg-white placeholder:text-deeppurpel/50 border-2 border-specialorange/70 font-mono",
          isValide ? "border-green-400" : "",
          isError ? "border-red-400" : ""
        )}
        placeholder="enter the code"
        type="text"
      />
      <button
        disabled={loading}
        type="submit"
        className="text-sm bg-orange-400 px-8 font-semibold  text-white py-3  rounded-lg hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:bg-orange-300"
      >
        join
      </button>
    </form>
  );
};

export default Action;
