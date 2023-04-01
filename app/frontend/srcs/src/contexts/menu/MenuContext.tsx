import { createContext } from "react";

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
