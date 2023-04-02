import { useState } from "react";
import { MenuContext } from "./MenuContext";

type MenuProviderProps = { children: JSX.Element | JSX.Element[] };
const MenuProvider = ({ children }: MenuProviderProps) => {
    const [display, setDisplay] = useState(false);
    const [displayNotifs, setDisplayNotifs] = useState(false);

    function toogle() {
        setError(false);
        setDisplayNotifs(false);
        setDisplay((prevState) => !prevState);
        let appContent = document.getElementById("home-main");
        if (appContent) {
            if (display === false) {
                appContent.style.marginBlockStart = "90px";
            } else {
                appContent.style.marginBlockStart = "20px";
            }
        }
    }

    function close() {
        setError(false);
        setErrorMessage("");
        setDisplayNotifs(false);
        setDisplay(false);
        let appContent = document.getElementById("home-main");
        if (appContent) {
            appContent.style.marginBlockStart = "20px";
        }
    }

    function toogleNotifs() {
        setError(false);
        setDisplay(false);
        setDisplayNotifs((prevState) => !prevState);
    }

    function closeNotifs() {
        close();
    }

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function displayError(error: string) {
        setErrorMessage(error);
        setError(true);
    }

    function closeError() {
        close();
    }

    const value = {
        display,
        setDisplay,
        toogle,
        close,
        error,
        errorMessage,
        displayError,
        closeError,
        displayNotifs,
        setDisplayNotifs,
        toogleNotifs,
        closeNotifs,
    };

    return (
        <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
    );
};

export default MenuProvider;
