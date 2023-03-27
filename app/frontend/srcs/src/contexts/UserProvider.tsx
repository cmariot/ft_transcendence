import axios from "axios";
import { createContext, useContext, useState } from "react";
import { MenuContext } from "./MenuProviders";

export type UserContextType = {
    username: string;
    avatar: string;
    doubleAuth: boolean;
    friends: { username: string; status: string; avatar: string }[];
    blocked: { username: string; avatar: string }[];
    isLogged: boolean;
    isFirstLog: boolean;
    isForcedLogout: boolean;
    winRatio: {
        victory: number;
        defeat: number;
    };
    gameHistory: {
        winner: string;
        loser: string;
        winner_score: number;
        loser_score: number;
    }[];
    rank: number;
    notifications: {
        message: string;
        type: string;
    }[];
};

export const UserContext = createContext({
    username: "",
    editUsername: (newUsername: string) => {},
    avatar: "",
    editAvatar: (newAvatar: string) => {},
    doubleAuth: true,
    editDoubleAuth: (newValue: boolean) => {},
    friends: new Array<{ username: string; status: string; avatar: string }>(),
    setFriends: (
        friends: { username: string; status: string; avatar: string }[]
    ) => {},
    blocked: new Array<{ username: string; avatar: string }>(),
    setBlocked: (blocked: { username: string; avatar: string }[]) => {},
    isLogged: false,
    setIsLogged: (newValue: boolean) => {},
    isFirstLog: false,
    setIsFirstLog: (newValue: boolean) => {},
    status: "",
    setStatus: (newStatus: string) => {},
    addFriend: async (username: string) => {
        return new Array<{
            username: string;
            status: string;
            avatar: string;
        }>();
    },
    removeFriend: async (username: string) => {},
    block: async (username: string) => {},
    unblock: async (username: string) => {},
    isForcedLogout: false,
    setIsForcedLogout: (newValue: boolean) => {},
    clickOnLogin: false,
    setClickOnLogin: (newValue: boolean) => {},
    clickOnLogout: false,
    setClickOnLogout: (newValue: boolean) => {},
    winRatio: { victory: 0, defeat: 0 },
    setWinRatio: (newValue: { victory: number; defeat: number }) => {},
    gameHistory: new Array<{
        winner: string;
        loser: string;
        winner_score: number;
        loser_score: number;
    }>(),
    setGamehistory: (
        newValue: {
            winner: string;
            loser: string;
            winner_score: number;
            loser_score: number;
        }[]
    ) => {},
    rank: 0,
    setRank: (newRank: number) => {},
    notifications: new Array<{
        message: string;
        type: string;
    }>(),
    setNotifications: (
        newValue: {
            message: string;
            type: string;
        }[]
    ) => {},
});

type UserProviderProps = { children: JSX.Element | JSX.Element[] };
const UserProvider = ({ children }: UserProviderProps) => {
    const menu = useContext(MenuContext);

    const [username, editUsername] = useState("");
    const [avatar, editAvatar] = useState("");
    const [doubleAuth, editDoubleAuth] = useState(true);
    const [friends, setFriends] = useState<
        { username: string; status: string; avatar: string }[]
    >(new Array<{ username: string; status: string; avatar: string }>());
    const [blocked, setBlocked] = useState<
        { username: string; avatar: string }[]
    >(new Array<{ username: string; avatar: string }>());
    const [isLogged, setIsLogged] = useState(false);
    const [isFirstLog, setIsFirstLog] = useState(false);
    const [status, setStatus] = useState("");
    const [isForcedLogout, setIsForcedLogout] = useState(false);
    const [clickOnLogin, setClickOnLogin] = useState(false);
    const [clickOnLogout, setClickOnLogout] = useState(false);
    const [winRatio, setWinRatio] = useState<{
        victory: number;
        defeat: number;
    }>({
        victory: 0,
        defeat: 0,
    });
    const [gameHistory, setGamehistory] = useState<
        {
            winner: string;
            loser: string;
            winner_score: number;
            loser_score: number;
        }[]
    >([]);
    const [rank, setRank] = useState(0);
    const [notifications, setNotifications] = useState<
        {
            message: string;
            type: string;
        }[]
    >([]);

    async function addFriend(friendUsername: string) {
        let friendList = friends;
        try {
            const friendsResponse = await axios.post(
                "/api/profile/friends/add",
                {
                    username: friendUsername,
                }
            );
            if (friendsResponse.status === 201) {
                let avatar: string;
                try {
                    const url = "/api/profile/" + friendUsername + "/image";
                    const avatarResponse = await axios.get(url, {
                        responseType: "blob",
                    });
                    if (avatarResponse.status === 200) {
                        let imageUrl = URL.createObjectURL(avatarResponse.data);
                        avatar = imageUrl;
                    } else {
                        avatar = url;
                    }
                    friendList.push({
                        username: friendUsername,
                        status: friendsResponse.data.status,
                        avatar: avatar,
                    });
                    setFriends(friendList);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
        return friendList;
    }

    async function removeFriend(friendUsername: string) {
        await axios
            .post("/api/profile/friends/remove", {
                username: friendUsername,
            })
            .then(function () {
                let friends_list = friends;
                let index = friends_list.findIndex(
                    (friend) => friend.username === friendUsername
                );
                if (index !== -1) {
                    friends_list.splice(index, 1);
                    setFriends(friends_list);
                }
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    }

    async function block(blockUsername: string) {
        try {
            const blockResponse = await axios.post("/api/profile/block", {
                username: blockUsername,
            });
            if (blockResponse.status === 201) {
                let blockList = blocked;
                let avatar: string;
                try {
                    const url = "/api/profile/" + blockUsername + "/image";
                    const avatarResponse = await axios.get(url, {
                        responseType: "blob",
                    });
                    if (avatarResponse.status === 200) {
                        let imageUrl = URL.createObjectURL(avatarResponse.data);
                        avatar = imageUrl;
                    } else {
                        avatar = url;
                    }
                    blockList.push({
                        username: blockUsername,
                        avatar: avatar,
                    });
                    setBlocked(blockList);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error: any) {
            menu.displayError(error.response.data.message);
        }
    }

    async function unblock(blockUsername: string) {
        await axios
            .post("/api/profile/unblock", { username: blockUsername })
            .then(() => {
                let blocked_list = blocked;
                let index = blocked_list.findIndex(
                    (block) => block.username === blockUsername
                );
                if (index !== -1) {
                    blocked_list.splice(index, 1);
                    setBlocked(blocked_list);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

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
        addFriend,
        removeFriend,
        block,
        unblock,
        isForcedLogout,
        setIsForcedLogout,
        clickOnLogin,
        setClickOnLogin,
        clickOnLogout,
        setClickOnLogout,
        winRatio,
        setWinRatio,
        gameHistory,
        setGamehistory,
        rank,
        setRank,
        notifications,
        setNotifications,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export default UserProvider;
