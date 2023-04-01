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
