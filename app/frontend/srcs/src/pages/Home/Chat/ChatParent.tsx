import { UserContext } from "../../../Contexts/UserProvider";
import { ChatContext } from "../../../Contexts/ChatProvider";
import { socket } from "../../../Contexts/WebsocketContext";
import axios from "axios";
import { useContext, useEffect } from "react";

export const ChatParent = () => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    useEffect(() => {
        socket.on("newChannelAvailable", () => {
            //setFirstLoad(!firstLoad);
        });
        socket.on("banUser", (socket) => {
            if (
                socket.username === user.username &&
                socket.channel === chat.channel
            ) {
                //setFirstLoad(!firstLoad);
                let currentUserChannels = chat.userChannels;
                let currentAvailableChannels = chat.availableChannels;
                if (currentUserChannels.has(socket.channelName) === true) {
                    currentUserChannels.delete(socket.channelName);
                    chat.updateUserChannels(currentUserChannels);
                }
                if (
                    currentAvailableChannels.has(socket.channelName) === false
                ) {
                    currentAvailableChannels.delete(socket.channelName);
                    chat.updateAvailableChannels(currentAvailableChannels);
                }
                chat.setIsBan(true);
            }
        });
        socket.on("kickUser", (socket) => {
            if (
                socket.username === user.username &&
                socket.channel === chat.channel
            ) {
                //setFirstLoad(!firstLoad);
                chat.setIsBan(true);
            }
        });
        socket.on("isChannelDeleted", (socket) => {
            if (socket.channel === chat.channel) {
                chat.setisChannelDeleted(true);
            }
        });
        socket.on("isChannelAdminUpdate", (socket) => {
            if (
                socket.channel === chat.channel &&
                socket.username === user.username
            ) {
                chat.setisChannelAdmin(socket.value);
                axios
                    .post("/api/chat/private/get_users", {
                        channelName: socket.channel,
                    })
                    .then((response) => {
                        chat.setUsers(response.data);
                    })
                    .catch((error) => console.log(error.data));
            }
        });
        socket.on("userLeaveChannel", (socket) => {
            let current_users: string[] = chat.users;
            let index = current_users.findIndex(
                (element) => element === socket.username
            );
            if (index !== -1) {
                current_users.splice(index, 1);
                chat.setUsers(current_users);
            }
            let current_admins: string[] = chat.admins;
            index = current_admins.findIndex(
                (element) => element === socket.username
            );
            if (index !== -1) {
                current_admins.splice(index, 1);
                chat.setAdmins(current_admins);
            }
        });
        socket.on("unban/unmute", (socket) => {
            if (socket.status === "mute") {
                chat.setmutedUsers(socket.users_list);
            } else if (socket.status === "ban") {
                chat.setbannedUsers(socket.users_list);
            }
        });
    });
    useEffect(() => {
        socket.on("newChatMessage", (socket) => {
            const socketChannel: string = socket.channel;
            if (socketChannel === chat.channel) {
                axios
                    .post("/api/chat/messages", { channelName: socket.channel })
                    .then((response) =>
                        chat.setMessages(response.data.messages)
                    )
                    .catch((error) => console.log(error.data));
            }
        });
    }, [chat]);
};
