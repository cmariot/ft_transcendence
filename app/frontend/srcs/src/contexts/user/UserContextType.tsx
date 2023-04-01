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
