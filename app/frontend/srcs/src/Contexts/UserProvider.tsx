import { createContext, useState } from "react";

export type UserContextType = {
    username: string;
    avatar: string;
    firstLog: boolean;
    doubleAuth: boolean;
    friends: string[];
    blocked: string[];
    friendUpdate: boolean;
};

export const UserContext = createContext({
    username: "",
    editUsername: (newUsername: string) => {},
    avatar: "",
    editAvatar: (newAvatar: string) => {},
    firstLog: false,
    setFirstLog: (newValue: boolean) => {},
    isLogged: false,
    setIsLogged: (newValue: boolean) => {},
    doubleAuth: true,
    editDoubleAuth: (newValue: boolean) => {},
    friends: [],
    setFriends: (newFriends: []) => {},
    blocked: [],
    setBlocked: (newFriends: []) => {},
    friendUpdate: false,
});

type UserProviderProps = { children: JSX.Element | JSX.Element[] };
const UserProvider = ({ children }: UserProviderProps) => {
    const [username, editUsername] = useState("");
    const [avatar, editAvatar] = useState("");
    const [doubleAuth, editDoubleAuth] = useState(true);
    const [friends, setFriends] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [firstLog, setFirstLog] = useState(false);
    const [friendUpdate, setFriendUpdate] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const value = {
        username,
        editUsername,
        avatar,
        editAvatar,
        isLogged,
        setIsLogged,
        firstLog,
        setFirstLog,
        doubleAuth,
        editDoubleAuth,
        friends,
        setFriends,
        blocked,
        setBlocked,
        friendUpdate,
        setFriendUpdate,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export default UserProvider;
