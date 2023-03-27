import { createContext, useState } from "react";

export type MenuContextType = {
    display: boolean;
    setDisplay: (newValue: boolean) => {};
    toogle: () => {};
    close: () => {};

    displayNotifs: boolean;
    setDisplayNotifs: (newValue: boolean) => {};
    toogleNotifs: () => {};
    closeNotifs: () => {};

    error: boolean;
    errorMessage: string;
    displayError: (error: string) => {};
    closeError: () => {};
};

export const MenuContext = createContext({
    display: false,
    setDisplay: (newValue: boolean) => {},
    toogle: () => {},
    close: () => {},

    displayNotifs: false,
    setDisplayNotifs: (newValue: boolean) => {},
    toogleNotifs: () => {},
    closeNotifs: () => {},

    error: false,
    errorMessage: "",
    displayError: (error: string) => {},
    closeError: () => {},
});

type MenuProviderProps = { children: JSX.Element | JSX.Element[] };
const MenuProvider = ({ children }: MenuProviderProps) => {
    const [display, setDisplay] = useState(false);
    const [displayNotifs, setDisplayNotifs] = useState(false);

    function toogle() {
        setError(false);
        setDisplayNotifs(false);
        setDisplay((prevState) => !prevState);
    }

    function close() {
        setError(false);
        setErrorMessage("");
        setDisplayNotifs(false);
        setDisplay(false);
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
