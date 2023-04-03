import { useState } from "react";
import { MenuContext } from "./MenuContext";

type MenuProviderProps = { children: JSX.Element | JSX.Element[] };
const MenuProvider = ({ children }: MenuProviderProps) => {
    const [display, setDisplay] = useState(false);
    const [displayNotifs, setDisplayNotifs] = useState(false);

    function toogle() {
        setError(false);
        setErrorMessage("");
        setDisplay((prevState) => !prevState);
        let appContent = document.getElementById("app-content");
        if (appContent) {
            if (display === false) {
                appContent.style.marginBlockStart = "90px";
            } else {
                appContent.style.marginBlockStart = "20px";
            }
        }
    }

    function close() {
        setDisplayNotifs(false);
        setError(false);
        setErrorMessage("");
        setDisplay(false);
        let appContent = document.getElementById("app-content");
        if (appContent) {
            appContent.style.marginBlockStart = "20px";
        }
    }

    function toogleNotifs() {
        setError(false);
        setErrorMessage("");
        setDisplayNotifs((prevState) => !prevState);
    }

    function closeNotifs() {
        setError(false);
        setErrorMessage("");
        setDisplayNotifs(false);
    }

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function displayError(error: string) {
        closeNotifs();
        setErrorMessage(error);
        setError(true);
    }

    function closeError() {
        setDisplayNotifs(false);
        setDisplay(false);
        let appContent = document.getElementById("app-content");
        if (appContent) {
            appContent.style.marginBlockStart = "20px";
        }
        setErrorMessage("");
        setError(false);
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
