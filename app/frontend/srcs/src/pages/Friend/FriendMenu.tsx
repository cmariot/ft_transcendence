import axios, { HttpStatusCode } from "axios";
import "../../styles/Friends.css";
import { useContext } from "react";
import { ChatContext } from "../../Contexts/ChatProvider";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserProvider";

export default function FriendMenu(props: any) {
    let chat = useContext(ChatContext);
    let user = useContext(UserContext);
    const navigate = useNavigate();

    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    async function blockUser(username: string) {
        props.closeMenu();
        await axios
            .post("/api/profile/block", { username: username })
            .then(async (response) => {
                user.setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.setDirectMessageUser(username);
                    chat.setPage("CreatePrivate");
                    return navigate("/");
                } else {
                    chat.setPage("ChatConv");
                    chat.setChannel(response.data.channelName);
                    chat.setMessages(response.data.data.messages);
                    chat.setisChannelOwner(response.data.data.channel_owner);
                    chat.setChannelType("private");
                    chat.setAdmins(response.data.data.channel_admins);
                    chat.setmutedUsers(response.data.data.muted_users);
                    chat.setbannedUsers(response.data.data.banned_users);
                    return navigate("/");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function removeFriend(friendUsername: string) {
        await axios
            .post("/api/profile/friends/remove", {
                username: friendUsername,
            })
            .then(function (response) {
                user.setFriends(response.data);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    }

    return (
        <menu className="friend-menu">
            <button className="friend-menu-button">
                Invite to play (todo)
            </button>
            <button
                className="friend-menu-button"
                onClick={() => directMessage(props.friend["username"])}
            >
                Direct message
            </button>
            <button
                className="friend-menu-button"
                onClick={() => profile(props.friend["username"])}
            >
                Profile
            </button>
            <button
                className="friend-menu-button"
                onClick={() => removeFriend(props.friend["username"])}
            >
                Remove Friend
            </button>
            <button
                className="friend-menu-button"
                onClick={() => blockUser(props.friend["username"])}
            >
                Block
            </button>
        </menu>
    );
}
