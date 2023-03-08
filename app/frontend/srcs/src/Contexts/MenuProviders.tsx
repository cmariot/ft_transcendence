import { createContext, useState } from "react";

export type MenuContextType = {
    display: boolean;
    setDisplay: (newValue: boolean) => {};
    toogle: () => {};
    close: () => {};
};

export const MenuContext = createContext({
    display: false,
    setDisplay: (newValue: boolean) => {},
    toogle: () => {},
    close: () => {},
});

type MenuProviderProps = { children: JSX.Element | JSX.Element[] };
const MenuProvider = ({ children }: MenuProviderProps) => {
    const [display, setDisplay] = useState(false);

    function toogle() {
        setDisplay((prevState) => !prevState);
    }

    function close() {
        setDisplay(false);
    }

    const value = {
        display,
        setDisplay,
        toogle,
        close,
    };

    return (
        <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
    );
};

export default MenuProvider;
