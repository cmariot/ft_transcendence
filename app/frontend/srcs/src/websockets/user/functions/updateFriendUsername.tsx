import axios from "axios";

export function updateFriendUsername(
    data: {
        previousUsername: string;
        newUsername: string;
    },
    user: any,
    chat: any,
    menu: any
) {
    if (data.newUsername !== user.username) {
        // update friends
        let friends = user.friends;
        let index = friends.findIndex(
            (friend: any) => friend.username === data.previousUsername
        );
        if (index !== -1) {
            friends[index].username = data.newUsername;
            user.setFriends(friends);
        }

        // update blocked
        let blocked = user.blocked;
        index = blocked.findIndex(
            (blocked: any) => blocked.username === data.previousUsername
        );
        if (index !== -1) {
            blocked[index].username = data.newUsername;
            user.setBlocked(friends);
        }

        // update game history
        let history = user.gameHistory;
        for (let i = 0; i < history.length; i++) {
            if (history[i].loser === data.previousUsername) {
                history[i].loser = data.newUsername;
            } else if (history[i].winner === data.previousUsername) {
                history[i].winner = data.newUsername;
            }
        }
        user.setGamehistory(history);

        // update chat
        if (chat.channel.length)
            axios
                .post("/api/chat/connect", {
                    channelName: chat.channel,
                })
                .then(function (response: any) {
                    chat.setMessages(response.data.messages);
                })
                .catch(function (error) {
                    menu.displayError(error.response.data.message);
                });
    }
}
