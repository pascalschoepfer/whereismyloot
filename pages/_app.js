import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import {useEffect} from "react";
import { Analytics } from '@vercel/analytics/react';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

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
