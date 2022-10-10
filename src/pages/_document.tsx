import Document , {Head, Html, Main, NextScript } from "next/document";


class MyDocument extends Document {
    public render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="google" content="notranslate" />
                    <meta name="theme-color" content="#ffffff" />

                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />

                    <style>
                        {`
                            * {
                                box-sizing: border-box;
                                font-family: Arial;
                            }
                        `}
                    </style>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
