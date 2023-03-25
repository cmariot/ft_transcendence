import { createContext, useState } from "react";

export type MenuContextType = {
    display: boolean;
    setDisplay: (newValue: boolean) => {};
    toogle: () => {};
    close: () => {};

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

    error: false,
    errorMessage: "",
    displayError: (error: string) => {},
    closeError: () => {},
});

type MenuProviderProps = { children: JSX.Element | JSX.Element[] };
const MenuProvider = ({ children }: MenuProviderProps) => {
    const [display, setDisplay] = useState(false);

    function toogle() {
        closeError();
        setDisplay((prevState) => !prevState);
    }

    function close() {
        closeError();
        setDisplay(false);
    }

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function displayError(error: string) {
        setErrorMessage(error);
        setError(true);
    }

    function closeError() {
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
    };

    return (
        <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
    );
};

export default MenuProvider;
