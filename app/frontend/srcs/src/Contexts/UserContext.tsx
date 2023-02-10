import { createContext } from "react";

var user = {
    username: "",
    avatar: "",
    doubleAuth: true,
    friends: [],
    updateUsername: (newUsername: string) => {},
    updateAvatar: (newAvatar: any) => {},
    updateDoubleAuth: () => {},
    addFriend: (newFriend: string) => {},
    removeFriend: (previousFriend: string) => {},
};

const UserContext = createContext(user);
export default UserContext;
