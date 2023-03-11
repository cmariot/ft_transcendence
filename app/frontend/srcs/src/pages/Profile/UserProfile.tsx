import { useLoaderData, useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";
import { ChatContext } from "../../contexts/ChatProvider";

export function loader({ params }: any) {
    return params;
}

const UserProfile = () => {
    const params: any = useLoaderData();
    const navigate = useNavigate();
    const [found, setFound] = useState(true);
    const [image, setImage] = useState("");
    const [friend, setFriend] = useState(false);
    const [blocked, setBlocked] = useState(false);

    let user = useContext(UserContext);
    let chat = useContext(ChatContext);

    const username: string = params.user;
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
        if (chat.channel.length) {
            await axios
                .post("/api/chat/connect", { channelName: chat.channel })
                .then(function (response: any) {
                    chat.setChannel(chat.channel);
                    chat.setChannelType(chat.channelType);
                    chat.setMessages(response.data.messages);
                })
                .catch(function (error) {
                    alert(error.response.data.message);
                });
        }
        navigate(-1);
    }

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
                                onClick={() => {
                                    user.unblock(username);
                                    setBlocked(false);
                                }}
                            >
                                unblock
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    user.block(username);
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
