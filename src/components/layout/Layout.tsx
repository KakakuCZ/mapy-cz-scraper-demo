import * as React from "react";
import {TopBar} from "../topBar/TopBar";

export const Layout: React.FunctionComponent<React.PropsWithChildren> = (props) => {
    return <>
        <TopBar />
        {props.children}
    </>
}
