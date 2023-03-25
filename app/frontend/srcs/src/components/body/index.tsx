import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { MenuContext } from "../../contexts/MenuProviders";
import { StatusEvents } from "./StatusEvents";
import { ChatEvents } from "./ChatEvents";
import { NavBar } from "../navbar/index";
import { Menu } from "../menu/menu";
import { Footer } from "../footer/index";
import { GameEvents } from "./GameEvents";
import ErrorPage from "../../utils/ErrorPage";

export const Body = () => {
    const menu = useContext(MenuContext);

    return (
        <StatusEvents>
            <ChatEvents>
                <GameEvents>
                    <NavBar />
                    {menu.error ? (
                        <ErrorPage />
                    ) : menu.display ? (
                        <Menu />
                    ) : (
                        <Outlet />
                    )}
                    <Footer />
                </GameEvents>
            </ChatEvents>
        </StatusEvents>
    );
};
