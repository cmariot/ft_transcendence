import { createContext } from "react";

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
