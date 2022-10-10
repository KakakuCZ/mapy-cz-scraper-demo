import * as React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";

interface TopbarItem {
    label: string;
    href: string;
}
const items: TopbarItem[] = [
    {label: "Estates", href: "/",},
    {label: "Scrape", href: "/api/crawl-estates/500"},
]

export const TopBar: React.FunctionComponent = () => {
    return <Navbar bg="dark" variant="dark">
        <Container>
            <Navbar.Brand href="#home">S-reality crawler</Navbar.Brand>
            <Nav className="me-auto">
                {items.map((item, i) => {
                    return <Nav.Link
                        key={i}
                        active={item.href === "/"}
                        href={item.href}
                    >
                        {item.label}
                    </Nav.Link>
                })}
            </Nav>
        </Container>
    </Navbar>
}
