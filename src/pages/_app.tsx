import * as React from "react";
import { AppProps } from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Layout} from "../components/layout/Layout";

const MyApp: React.FunctionComponent<AppProps> = ({Component, pageProps}) => {
    return <Layout>
        <Component
            {...pageProps}
        />
    </Layout>
}

export default MyApp;
