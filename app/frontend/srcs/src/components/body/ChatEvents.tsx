import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    function arrayToMap(array: Array<any>) {
        let map = new Map<
            string,
            { channelName: string; channelType: string }
        >();
        for (let i = 0; i < array.length; i++) {
            if (array[i].channelName) {
                map.set(array[i].channelName, array[i]);
            }
        }
        return map;
    }

    // When a new channel is available
    useEffect(() => {
        async function updateChannels() {
            try {
                const channelsResponse = await axios.get("/api/chat/channels");
                if (channelsResponse.status === 200) {
                    chat.updateUserChannels(
                        arrayToMap(channelsResponse.data.userChannels)
                    );
                    chat.updateUserPrivateChannels(
                        arrayToMap(channelsResponse.data.userPrivateChannels)
                    );
                    chat.updateAvailableChannels(
                        arrayToMap(channelsResponse.data.availableChannels)
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }
        socket.on("chat.new.channel", updateChannels);
        return () => {
            socket.off("chat.new.channel", updateChannels);
        };
    }, [chat, socket]);

    // When a channel is deleted
    useEffect(() => {
        async function updateChannels(data: { channel: string }) {
            try {
                const channelsResponse = await axios.get("/api/chat/channels");
                if (channelsResponse.status === 200) {
                    chat.updateUserChannels(
                        arrayToMap(channelsResponse.data.userChannels)
                    );
                    chat.updateUserPrivateChannels(
                        arrayToMap(channelsResponse.data.userPrivateChannels)
                    );
                    chat.updateAvailableChannels(
                        arrayToMap(channelsResponse.data.availableChannels)
                    );
                }
            } catch (error) {
                console.log(error);
            }
            if (chat.channel === data.channel) {
                chat.setMessages([]);
                chat.setChannel("");
                chat.setChannelType("");
                chat.setmutedUsers([]);
                chat.setbannedUsers([]);
                chat.closeMenu();
                chat.setPage("YourChannels");
                //chat.leaveChannel(chat.channel, chat.channelType);
            }
        }
        socket.on("chat.deleted.channel", updateChannels);
        return () => {
            socket.off("chat.deleted.channel", updateChannels);
        };
    }, [chat, socket]);

    // When new message
    useEffect(() => {
        async function updateMessages() {
            try {
                const messageResponse = await axios.post("/api/chat/messages", {
                    channelName: chat.channel,
                });
                if (messageResponse.status === 201) {
                    chat.setMessages(messageResponse.data.messages);
                }
            } catch (error) {
                console.log(error);
            }
        }
        socket.on("chat.message", updateMessages);
        return () => {
            socket.off("chat.message", updateMessages);
        };
    }, [chat, socket]);

    // When a new admin is add
    useEffect(() => {
        async function updateAdmins(data: {
            username: string;
            channel: string;
        }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let admins = chat.admins;
                    admins.push(data.username);
                    chat.setAdmins(admins);
                } else if (data.username === user.username) {
                    await axios
                        .post("/api/chat/connect", {
                            channelName: data.channel,
                        })
                        .then(function (response: any) {
                            chat.setisChannelAdmin(response.data.channel_admin);
                            chat.setAdmins(response.data.channel_admins);
                            chat.setmutedUsers(response.data.muted_users);
                            chat.setbannedUsers(response.data.banned_users);
                        })
                        .catch(function (error) {
                            alert(error.response.data.message);
                        });
                }
            }
        }
        socket.on("chat.new.admin", updateAdmins);
        return () => {
            socket.off("chat.new.admin", updateAdmins);
        };
    }, [chat, socket, user]);

    // When a new admin is removed
    useEffect(() => {
        async function updateAdmins(data: {
            username: string;
            channel: string;
        }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let admins = chat.admins;
                    let index = admins.findIndex(
                        (admins) => admins === data.username
                    );
                    if (index !== -1) {
                        admins.slice(index, 1);
                        chat.setAdmins(admins);
                    }
                } else if (data.username === user.username) {
                    await axios
                        .post("/api/chat/connect", {
                            channelName: data.channel,
                        })
                        .then(function (response: any) {
                            chat.setisChannelAdmin(response.data.channel_admin);
                            chat.setAdmins(response.data.channel_admins);
                            chat.setmutedUsers(response.data.muted_users);
                            chat.setbannedUsers(response.data.banned_users);
                        })
                        .catch(function (error) {
                            alert(error.response.data.message);
                        });
                }
            }
        }
        socket.on("chat.remove.admin", updateAdmins);
        return () => {
            socket.off("chat.remove.admin", updateAdmins);
        };
    }, [chat, socket, user]);

    // When an user is banned
    useEffect(() => {
        async function updateBan(data: { channel: string; username: string }) {
            if (data.username === user.username) {
                try {
                    const channelsResponse = await axios.get(
                        "/api/chat/channels"
                    );
                    if (channelsResponse.status === 200) {
                        chat.updateUserChannels(
                            arrayToMap(channelsResponse.data.userChannels)
                        );
                        chat.updateUserPrivateChannels(
                            arrayToMap(
                                channelsResponse.data.userPrivateChannels
                            )
                        );
                        chat.updateAvailableChannels(
                            arrayToMap(channelsResponse.data.availableChannels)
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
                if (chat.channel === data.channel) {
                    chat.setMessages([]);
                    chat.setChannel("");
                    chat.setChannelType("");
                    chat.setmutedUsers([]);
                    chat.setbannedUsers([]);
                    chat.closeMenu();
                    chat.setPage("YourChannels");
                }
            } else if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let banned = chat.bannedUsers;
                    banned.push(data.username);
                    chat.setbannedUsers(banned);
                }
            }
        }
        socket.on("chat.user.ban", updateBan);
        return () => {
            socket.off("chat.user.ban", updateBan);
        };
    }, [chat, socket, user]);

    // When an user is unban
    useEffect(() => {
        async function updateBan(data: { channel: string; username: string }) {
            if (data.username === user.username) {
                try {
                    const channelsResponse = await axios.get(
                        "/api/chat/channels"
                    );
                    if (channelsResponse.status === 200) {
                        chat.updateUserChannels(
                            arrayToMap(channelsResponse.data.userChannels)
                        );
                        chat.updateUserPrivateChannels(
                            arrayToMap(
                                channelsResponse.data.userPrivateChannels
                            )
                        );
                        chat.updateAvailableChannels(
                            arrayToMap(channelsResponse.data.availableChannels)
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let banned = chat.bannedUsers;
                    let index = banned.findIndex(
                        (banned) => banned === data.username
                    );
                    if (index !== -1) {
                        banned.slice(index, 1);
                        chat.setbannedUsers(banned);
                    }
                }
            }
        }
        socket.on("chat.user.unban", updateBan);
        return () => {
            socket.off("chat.user.unban", updateBan);
        };
    }, [chat, socket, user]);

    // When an user is kicked
    useEffect(() => {
        async function updateUsers(data: {
            channel: string;
            username: string;
        }) {
            if (data.username === user.username) {
                try {
                    const channelsResponse = await axios.get(
                        "/api/chat/channels"
                    );
                    if (channelsResponse.status === 200) {
                        chat.updateUserChannels(
                            arrayToMap(channelsResponse.data.userChannels)
                        );
                        chat.updateUserPrivateChannels(
                            arrayToMap(
                                channelsResponse.data.userPrivateChannels
                            )
                        );
                        chat.updateAvailableChannels(
                            arrayToMap(channelsResponse.data.availableChannels)
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
                if (chat.channel === data.channel) {
                    chat.setMessages([]);
                    chat.setChannel("");
                    chat.setChannelType("");
                    chat.setmutedUsers([]);
                    chat.setbannedUsers([]);
                    chat.closeMenu();
                    chat.setPage("YourChannels");
                }
            } else if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    await axios
                        .post("/api/chat/connect", {
                            channelName: data.channel,
                        })
                        .then(function (response: any) {
                            chat.setisChannelAdmin(response.data.channel_admin);
                            chat.setAdmins(response.data.channel_admins);
                            chat.setmutedUsers(response.data.muted_users);
                            chat.setbannedUsers(response.data.banned_users);
                        })
                        .catch(function (error) {
                            alert(error.response.data.message);
                        });
                }
            }
        }
        socket.on("chat.user.kicked", updateUsers);
        return () => {
            socket.off("chat.user.kicked", updateUsers);
        };
    }, [chat, socket, user]);

    return <>{children}</>;
};
