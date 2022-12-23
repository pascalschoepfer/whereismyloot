import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import {useEffect} from "react";
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  useEffect(()=>{
    import("bootstrap/dist/js/bootstrap");
  },[])
  return (
      <>
        <Component {...pageProps} />
        <Analytics />
      </>
      )
}

export default MyApp
