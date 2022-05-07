import { useState } from "react";
import dynamic from "next/dynamic";

import Action from "../components/action";

import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import axios from "axios";
import backgroundImage from "../public/background-1.png";
import { NextSeo } from "next-seo";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Steps = dynamic(() => import("../components/steps"));

const Form = dynamic(() => import("../components/form"));
const Thankyou = dynamic(() => import("../components/thankyou"));

type Props = {
  year: number;
  title: string;
  titleAr: string;
  description: string;
};

const Home: React.FC<Props> = ({ description, title, titleAr, year }) => {
  const [valideCode, setValideCode] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState<number>(0);

  const [withImage, setWithImage] = useState(true);

  return (
    <>
      <NextSeo title={`${title} - ${titleAr}`} description={description} />
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-9 xl:pt-20 lg:pb-16">
        {valideCode && (
          <Form code={valideCode} setName={setName} setNumber={setNumber} />
        )}
        {name && <Thankyou name={name} number={number} />}

        <div
          className={classNames(
            "sm:mb-24 xl:mb-12 lg:flex text-gray-300",
            !withImage ? "justify-center" : ""
          )}
        >
          <div
            className={classNames(
              withImage ? "lg:flex-1" : "",
              "relative z-10 flex flex-col items-start lg:pt-10 max-w-screen-sm mx-auto lg:max-w-2xl lg:mx-0 lg:pr-20 mb-12 sm:mb-16 lg:mb-0"
            )}
          >
            <h1 className="order-1 text-3xl sm:text-5xl sm:leading-none font-extrabold tracking-tight text-white mb-4">
              Savoo
              <span className="grandient grandient-text"> {title} </span>
              {year}
            </h1>
            <p className="text-sm font-semibold tracking-wide uppercase mb-4">
              {titleAr}
            </p>
            <p className="order-2 leading-relaxed mb-8">{description}</p>
            <Steps />
            <Action setValideCode={setValideCode} />
          </div>

          <div className="relative flex flex-col max-w-screen-sm mx-auto lg:max-w-none lg:-ml-12 lg:mr-0 xl:-ml-6">
            <div className="relative lg:absolute -mt-5 top-[-20%] sm:top-[-40%] xl:top-[-50%] transform translate-x-[-34%] w-[40.312rem] sm:w-[60.5rem] max-w-none">
              <Image
                layout="responsive"
                quality={75}
                src={backgroundImage}
                alt="background image"
                aria-hidden="true"
                loading="lazy"
              />
            </div>

            <div
              className={classNames(
                "w-full space-y-2 lg:space-y-0 lg:w-[135%] opacity-70 group-hover:opacity-100 absolute top-0 flex flex-col lg:absolute sm:w-[56.25rem] lg:-top-300 lg:left-0 mx-auto lg:mx-0 mb-[-17%] sm:-mb-44 lg:mb-0",
                !withImage ? "hidden" : ""
              )}
            >
              <div className="w-full rounded-md overflow-hidden lg:mx-0 h-32 lg:h-[265px] lg:w-[560px] relative">
                <Image
                  layout="fill"
                  src="/image 16.png"
                  className="shadow-inner rounded-md w-full h-full object-cover"
                  alt="the first prize"
                  priority
                />
              </div>
              <div className="w-full lg:mx-0 h-32 relative lg:absolute lg:w-[236px] lg:h-[200px] lg:-left-[150px] lg:top-[297px] rounded-[6px]">
                <div className="absolute group-hover:opacity-0 inset-0 from-transparent to-deeppurpel/80 z-10 bg-gradient-to-b"></div>
                <Image
                  layout="fill"
                  src="/image 18.png"
                  className="shadow-inner rounded-md w-full h-full object-cover"
                  alt="the second prize"
                  loading="lazy"
                />
              </div>
              <div className="w-full lg:mx-0 h-32 relative lg:absolute lg:w-[476px] lg:h-[200px] lg:left-[150px] lg:top-[297px] rounded-[6px]">
                <div className="absolute inset-0 group-hover:opacity-0 from-transparent to-deeppurpel/80 z-10 bg-gradient-to-b"></div>

                <Image
                  layout="fill"
                  src="/image 17.png"
                  className="shadow-inner rounded-md w-full h-full object-cover"
                  alt="the third prize"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (props) => {
  const defaultProps = {
    redirect: {
      destination: "https://savoocare.com/",
    },
    props: {
      title: "",
      titleAr: "",
      year: 222,
      description: "",
    },
  };
  try {
    const { data } = await axios.get(
      "http://127.0.0.1:3002/internal/contest/latest"
    );

    return {
      props: {
        title: data.title,
        titleAr: data.title_ar,
        description: data.description,
        year: new Date().getFullYear(),
      },
    };
  } catch (e) {}

  return defaultProps;
};

export default Home;
