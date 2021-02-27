import Head from "next/head";
import styles from "../styles/Home.module.css";
import Main from "../components/main";

export default function Home() {
  return (
    <>
      <Head>
        <title>Jsondiff</title>
      </Head>
      <div className="container">
        <h3>
          A copy of{" "}
          <a href="http://jsondiff.com" target="_blank">
            http://jsondiff.com
          </a>{" "}
          written in React
        </h3>
      </div>
      <Main />
    </>
  );
}
