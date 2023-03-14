import { useContext } from "react";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserProvider";
import { ChatContext } from "../../../contexts/ChatProvider";

const ChatMessages = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();

    async function directMessage(username: string) {
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.setDirectMessageUser(username);
                    chat.setPage("CreatePrivate");
                    return;
                } else {
                    axios
                        .post("/api/chat/connect", {
                            channelName: response.data.channelName,
                        })
                        .then(function (response2) {
                            chat.setChannel(response.data.channelName);
                            chat.setChannelType(response.data.channelType);
                            chat.setMessages(response2.data.messages);
                            chat.setisChannelOwner(
                                response2.data.channel_owner
                            );
                            chat.setisChannelAdmin(
                                response2.data.channel_admin
                            );
                            chat.setAdmins(response2.data.channel_admins);
                            chat.setmutedUsers(response2.data.muted_users);
                            chat.setbannedUsers(response2.data.banned_users);
                            chat.setUsers(response2.data.private_channel_users);
                            chat.setPage("ChatConv");
                        })
                        .catch(function (error) {
                            console.log("joinChannel error: ", error);
                        });
                }
            })
            .catch((error) => {
                console.log("Catch : ", error);
            });
    }

    async function blockUser(username: string) {
        user.block(username);
        await axios
            .post("/api/chat/connect", {
                channelName: chat.channel,
            })
            .then((response) => {
                chat.setMessages(response.data.messages);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    function messageMenu(username: string) {
        if (username !== user.username) {
            if (chat.channelType === "direct_message") {
                return (
                    <div className="chat-user-message-options">
                        <button>play</button>
                        <button onClick={() => profile(username)}>
                            profile
                        </button>
                        <button onClick={() => blockUser(username)}>
                            block
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="chat-user-message-options">
                        <button onClick={() => directMessage(username)}>
                            message
                        </button>
                        <button>play</button>
                        <button onClick={() => profile(username)}>
                            profile
                        </button>
                        <button onClick={() => blockUser(username)}>
                            block
                        </button>
                    </div>
                );
            }
        }
    }

    return (
        <ul id="chat-main-ul">
            {chat.messages.map((item: any, index: any) => (
                <li className="chat-main-li" key={index}>
                    <p className="chat-menu-channel chatMessages">
                        {item.username} :<br />
                        {item.message}
                    </p>
                    {messageMenu(item.username)}
                </li>
            ))}
        </ul>
    );
};
export default ChatMessages;
