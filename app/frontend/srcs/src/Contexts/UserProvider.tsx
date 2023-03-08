import { createContext, useState } from "react";

export type UserContextType = {
    username: string;
    avatar: string;
    doubleAuth: boolean;
    friends: string[];
    blocked: string[];
    isLogged: boolean;
    isFirstLog: boolean;
};

export const UserContext = createContext({
    username: "",
    editUsername: (newUsername: string) => {},
    avatar: "",
    editAvatar: (newAvatar: string) => {},
    doubleAuth: true,
    editDoubleAuth: (newValue: boolean) => {},
    friends: [],
    setFriends: (newFriends: []) => {},
    blocked: [],
    setBlocked: (newFriends: []) => {},
    isLogged: false,
    setIsLogged: (newValue: boolean) => {},
    isFirstLog: false,
    setIsFirstLog: (newValue: boolean) => {},
    status: "",
    setStatus: (newStatus: string) => {},
});

type UserProviderProps = { children: JSX.Element | JSX.Element[] };
const UserProvider = ({ children }: UserProviderProps) => {
    const [username, editUsername] = useState("");
    const [avatar, editAvatar] = useState("");
    const [doubleAuth, editDoubleAuth] = useState(true);
    const [friends, setFriends] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [isLogged, setIsLogged] = useState(false);
    const [isFirstLog, setIsFirstLog] = useState(false);
    const [status, setStatus] = useState("");

    const value = {
        username,
        editUsername,
        avatar,
        editAvatar,
        doubleAuth,
        editDoubleAuth,
        friends,
        setFriends,
        blocked,
        setBlocked,
        isLogged,
        setIsLogged,
        isFirstLog,
        setIsFirstLog,
        status,
        setStatus,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export default UserProvider;
