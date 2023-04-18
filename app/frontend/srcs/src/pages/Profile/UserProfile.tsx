import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { UserContext } from "../../contexts/user/UserContext";

const UserProfile = () => {
    const menu = useContext(MenuContext);
    let user = useContext(UserContext);
    let chat = useContext(ChatContext);
    const params = useParams();
    const username: string =
        params.userprofile === undefined ? "" : params.userprofile;

    const navigate = useNavigate();

    const [found, setFound] = useState(true);
    const [image, setImage] = useState("");
    const [friend, setFriend] = useState(false);
    const [blocked, setBlocked] = useState(false);
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

    const imageURL: string = "/api/profile/" + username + "/image";

    useEffect(() => {
        if (user.username === username) {
            return navigate("/profile");
        }
        (async () => {
            try {
                const avatarResponse = await axios.get(imageURL, {
                    responseType: "blob",
                });
                if (avatarResponse.status === 200) {
                    var imageUrl = URL.createObjectURL(avatarResponse.data);
                    setImage(imageUrl);
                    setFound(true);
                    let i = 0;
                    while (i < user.friends.length) {
                        let friend: any = user.friends[i];
                        let friend_username: string = friend.username;
                        if (friend_username === username) {
                            setFriend(true);
                            break;
                        }
                        i++;
                    }
                    i = 0;
                    while (i < user.blocked.length) {
                        let blocked: any = user.blocked[i];
                        let blocked_username: string = blocked.username;
                        if (blocked_username === username) {
                            setBlocked(true);
                            break;
                        }
                        i++;
                    }
                } else {
                    setFound(false);
                }

                const gameHistoryResponse = await axios.post(
                    "/api/profile/game",
                    { username: username }
                );
                if (gameHistoryResponse.status === 201) {
                    setGamehistory(gameHistoryResponse.data.gameHistory);
                    setWinRatio(gameHistoryResponse.data.winRatio);
                    setRank(gameHistoryResponse.data.rank);
                }
            } catch (error: any) {
                menu.displayError(error.response.data.message);
                setFound(false);
            }
        })();
    }, [
        imageURL,
        navigate,
        user.blocked,
        user.friends,
        user.username,
        username,
        menu,
    ]);

    async function goToPrevious() {
        navigate(-1);
    }

    const socket = useContext(SocketContext);

    useEffect(() => {
        async function updateUserAvatar(data: { username: string }) {
            if (data.username === username) {
                try {
                    const url = "/api/profile/" + data.username + "/image";
                    const avatarResponse = await axios.get(url, {
                        responseType: "blob",
                    });
                    if (avatarResponse.status === 200) {
                        let imageUrl = URL.createObjectURL(avatarResponse.data);
                        setImage(imageUrl);
                    }
                } catch (error: any) {
                    menu.displayError(error.response.data.message);
                }
            }
        }
        socket.on("user.update.avatar", updateUserAvatar);
        return () => {
            socket.off("user.update.avatar", updateUserAvatar);
        };
    }, [user, socket, username, menu]);

    useEffect(() => {
        function updateUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
            if (data.previousUsername === username) {
                return navigate("/profile/" + data.newUsername);
            } else {
                let history = gameHistory;
                for (let i = 0; i < history.length; i++) {
                    if (history[i].loser === data.previousUsername) {
                        history[i].loser = data.newUsername;
                    } else if (history[i].winner === data.previousUsername) {
                        history[i].winner = data.newUsername;
                    }
                }
                setGamehistory(history);
            }
        }
        socket.on("user.update.username", updateUsername);
        return () => {
            socket.off("user.update.username", updateUsername);
        };
    }, [user, socket, username, navigate, gameHistory]);

    function winPercentage() {
        if (winRatio.victory + winRatio.defeat > 0) {
            let scale = Math.pow(10, 1);
            let percent =
                Math.round(
                    (winRatio.victory / (winRatio.victory + winRatio.defeat)) *
                        100 *
                        scale
                ) / scale;
            return "(" + percent.toString() + "%)";
        }
    }

    function losePercentage() {
        if (winRatio.victory + winRatio.defeat > 0) {
            let scale = Math.pow(10, 1);
            let percent =
                Math.round(
                    (winRatio.defeat / (winRatio.victory + winRatio.defeat)) *
                        100 *
                        scale
                ) / scale;
            return "(" + percent.toString() + "%)";
        }
    }

    function displayProfileOrError() {
        if (found) {
            return (
                <div>
                    <div>
                        <h2>{username}'s profile</h2>
                        {image && (
                            <img
                                id="profile-user-picture"
                                src={image}
                                alt="user-imag"
                            />
                        )}
                        <h3>{username}</h3>
                        <div>
                            {friend ? (
                                <button
                                    onClick={() => {
                                        user.removeFriend(username);
                                        setFriend(false);
                                    }}
                                >
                                    remove friend
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        user.addFriend(username);
                                        setFriend(true);
                                    }}
                                >
                                    add friend
                                </button>
                            )}
                            {blocked ? (
                                <button
                                    onClick={async () => {
                                        user.unblock(username);
                                        if (chat.channel !== "") {
                                            await axios
                                                .post("/api/chat/connect", {
                                                    channelName: chat.channel,
                                                })
                                                .then(function (response: any) {
                                                    chat.setMessages(
                                                        response.data.messages
                                                    );
                                                })
                                                .catch(function (error) {
                                                    menu.displayError(
                                                        error.response.data
                                                            .message
                                                    );
                                                });
                                        }
                                        setBlocked(false);
                                    }}
                                >
                                    unblock
                                </button>
                            ) : (
                                <button
                                    onClick={async () => {
                                        user.block(username);
                                        if (
                                            chat.channelType ===
                                            "direct_message"
                                        ) {
                                            let channels = new Map<
                                                string,
                                                { channelType: string }
                                            >(chat.userPrivateChannels);
                                            if (channels.delete(chat.channel)) {
                                                chat.updateUserPrivateChannels(
                                                    channels
                                                );
                                            }
                                            chat.setMessages([]);
                                            chat.setChannel("");
                                            chat.setChannelType("");
                                            chat.setmutedUsers([]);
                                            chat.setbannedUsers([]);
                                            chat.closeMenu();
                                            chat.setPage("YourChannels");
                                        } else {
                                            if (chat.channel !== "") {
                                                await axios
                                                    .post("/api/chat/connect", {
                                                        channelName:
                                                            chat.channel,
                                                    })
                                                    .then((response) => {
                                                        chat.setMessages(
                                                            response.data
                                                                .messages
                                                        );
                                                    })
                                                    .catch((error) => {
                                                        menu.displayError(
                                                            error.response.data
                                                                .message
                                                        );
                                                    });
                                            }
                                        }
                                        setBlocked(true);
                                    }}
                                >
                                    block
                                </button>
                            )}
                            <button onClick={() => goToPrevious()}>
                                return
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <h2>not found</h2>;
        }
    }
    return (
        <div className="main-app-div">
            <main id="profile">
                {displayProfileOrError()}
                {gameHistory.length > 0 && (
                    <div id="stats">
                        <div>
                            <p>Leaderboard rank : {rank}</p>
                            <p>
                                Game played :{" "}
                                {winRatio.defeat + winRatio.victory}
                            </p>
                            <p>
                                Game win : {winRatio.victory} {winPercentage()}
                            </p>
                            <p>
                                Game lose : {winRatio.defeat} {losePercentage()}
                            </p>
                        </div>
                        <div>
                            <ul id="games-list">
                                <h2>Game history</h2>
                                {gameHistory.map((game: any, index: number) => (
                                    <li className="match-results" key={index}>
                                        <div className="winner">
                                            <p>{game.winner}</p>
                                            <p>{game.winner_score}</p>
                                        </div>
                                        <div className="vs">
                                            <p>vs</p>
                                        </div>
                                        <div className="winner">
                                            <p>{game.loser}</p>
                                            <p>{game.loser_score}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserProfile;
