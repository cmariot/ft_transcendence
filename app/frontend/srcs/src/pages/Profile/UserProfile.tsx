import { useLoaderData, useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import { SocketContext } from "../../contexts/SocketProvider";

export function loader({ params }: any) {
    return params;
}

const UserProfile = () => {
    const params: any = useLoaderData();
    const username = params.user;

    const navigate = useNavigate();

    const [found, setFound] = useState(true);
    const [image, setImage] = useState("");
    const [friend, setFriend] = useState(false);
    const [blocked, setBlocked] = useState(false);

    let user = useContext(UserContext);
    let chat = useContext(ChatContext);

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
            } catch (error) {
                console.log(error);
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
                } catch (error) {
                    console.log(error);
                }
            }
        }
        socket.on("user.update.avatar", updateUserAvatar);
        return () => {
            socket.off("user.update.avatar", updateUserAvatar);
        };
    }, [user, socket, username]);

    useEffect(() => {
        function updateUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
            if (data.previousUsername === username) {
                return navigate("/profile/" + data.newUsername);
            }
        }
        socket.on("user.update.username", updateUsername);
        return () => {
            socket.off("user.update.username", updateUsername);
        };
    }, [user, socket, username, navigate]);

    function displayProfileOrError() {
        if (found) {
            return (
                <>
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
                                    if (chat.channel.length) {
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
                                                alert(
                                                    error.response.data.message
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
                                    if (chat.channel.length) {
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
                                                alert(
                                                    error.response.data.message
                                                );
                                            });
                                    }
                                    setBlocked(true);
                                }}
                            >
                                block
                            </button>
                        )}
                        <button onClick={() => goToPrevious()}>return</button>
                    </div>
                </>
            );
        } else {
            return <h2>not found</h2>;
        }
    }
    return <main id="profile">{displayProfileOrError()}</main>;
};

export default UserProfile;
