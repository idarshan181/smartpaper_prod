import Head from 'next/head';

import SignIn from '../components/SignIn';
export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>
          mySmartPaper&trade;
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignIn />
    </div>
  );
}
