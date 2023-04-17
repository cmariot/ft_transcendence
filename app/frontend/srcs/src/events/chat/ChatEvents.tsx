import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import axios from "axios";
import { arrayToMap } from "./functions/arrayToMap";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const socket = useContext(SocketContext);
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);

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
            } catch (error: any) {
                menu.displayError(error.response.data.message);
            }
        }
        socket.on("chat.new.channel", updateChannels);
        return () => {
            socket.off("chat.new.channel", updateChannels);
        };
    }, [socket, chat, menu]);

    // When a channel is deleted
    useEffect(() => {
        async function deleteChannels(data: { channel: string }) {
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
            }
        }
        socket.on("chat.deleted.channel", deleteChannels);
        return () => {
            socket.off("chat.deleted.channel", deleteChannels);
        };
    }, [socket, chat]);

    // When new message
    useEffect(() => {
        async function updateMessages() {
            if (chat.channel.length > 0) {
                try {
                    const messageResponse = await axios.post(
                        "/api/chat/messages",
                        {
                            channelName: chat.channel,
                        }
                    );
                    if (messageResponse.status === 201) {
                        chat.setMessages(messageResponse.data.messages);
                    }
                } catch (error: any) {
                    menu.displayError(error.response.data.message);
                }
            }
        }
        socket.on("chat.message", updateMessages);
        return () => {
            socket.off("chat.message", updateMessages);
        };
    }, [socket, chat]);

    // When a new admin is add
    useEffect(() => {
        async function addAdmins(data: { username: string; channel: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let admins = chat.admins;
                    let index = admins.findIndex(
                        (element) => element === data.username
                    );
                    if (index === -1) {
                        admins.push(data.username);
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
                            menu.displayError(error.response.data.message);
                        });
                }
            }
        }

        socket.on("chat.new.admin", addAdmins);
        return () => {
            socket.off("chat.new.admin", addAdmins);
        };
    }, [socket, chat, menu]);

    // When a admin is removed
    useEffect(() => {
        async function removeAdmins(data: {
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
                        (admins: any) => admins === data.username
                    );
                    if (index !== -1) {
                        admins.splice(index, 1);
                        chat.setAdmins(admins);
                    }
                }
                if (data.username === user.username) {
                    try {
                        const connectResponse = await axios.post(
                            "/api/chat/connect",
                            {
                                channelName: data.channel,
                            }
                        );
                        if (connectResponse.status === 201) {
                            chat.setisChannelAdmin(
                                connectResponse.data.channel_admin
                            );
                            chat.setAdmins(connectResponse.data.channel_admins);
                            chat.setmutedUsers(
                                connectResponse.data.muted_users
                            );
                            chat.setbannedUsers(
                                connectResponse.data.banned_users
                            );
                        }
                    } catch (connectResponse: any) {
                        menu.displayError(
                            connectResponse.response.data.message
                        );
                    }
                }
            }
        }
        socket.on("chat.remove.admin", removeAdmins);
        return () => {
            socket.off("chat.remove.admin", removeAdmins);
        };
    }, [socket, chat, menu, user]);

    // When an user is mute
    useEffect(() => {
        async function mute(data: { channel: string; username: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let muted = chat.mutedUsers;
                    if (
                        muted.findIndex(
                            (mute: any) => mute === data.username
                        ) === -1
                    ) {
                        muted.push(data.username);
                        chat.setmutedUsers(muted);
                    }
                }
            }
        }

        socket.on(
            "chat.user.mute",
            (data: { channel: string; username: string }) => mute(data)
        );
        return () => {
            socket.off("chat.user.mute", mute);
        };
    }, [socket, chat]);

    // When an user is unmute
    useEffect(() => {
        async function unmute(data: { channel: string; username: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let muted = chat.mutedUsers;
                    let index = muted.findIndex(
                        (muted: any) => muted === data.username
                    );
                    if (index !== -1) {
                        muted.splice(index, 1);
                        chat.setmutedUsers(muted);
                    }
                }
            }
        }
        socket.on("chat.user.unmute", unmute);
        return () => {
            socket.off("chat.user.unmute", unmute);
        };
    }, [socket, chat]);

    // When an user is banned
    useEffect(() => {
        async function ban(data: { channel: string; username: string }) {
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
                    if (
                        banned.findIndex(
                            (ban: any) => ban === data.username
                        ) === -1
                    ) {
                        banned.push(data.username);
                        chat.setbannedUsers(banned);
                    }
                }
            }
        }
        socket.on(
            "chat.user.ban",
            (data: { channel: string; username: string }) => ban(data)
        );
        return () => {
            socket.off("chat.user.ban", ban);
        };
    }, [socket, chat, user]);

    // When an user is unban
    useEffect(() => {
        async function unban(data: { channel: string; username: string }) {
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
                        (banned: any) => banned === data.username
                    );
                    if (index !== -1) {
                        banned.splice(index, 1);
                        chat.setbannedUsers(banned);
                    }
                }
            }
        }

        socket.on(
            "chat.user.unban",
            (data: { channel: string; username: string }) => unban(data)
        );
        return () => {
            socket.off("chat.user.unban", unban);
        };
    }, [socket, chat, user]);

    // When an user is kicked
    useEffect(() => {
        async function kick(data: { channel: string; username: string }) {
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
                            menu.displayError(error.response.data.message);
                        });
                }
            }
        }

        socket.on(
            "chat.user.kicked",
            (data: { channel: string; username: string }) => kick(data)
        );
        return () => {
            socket.off("chat.user.kicked", kick);
        };
    }, [socket, user, chat]);

    // When an user leave a private channel
    useEffect(() => {
        async function leavePrivate(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex(
                (muted: any) => muted === data.username
            );
            if (index !== -1) {
                users.splice(index, 1);
                chat.setUsers(users);
            }
        }
        socket.on(
            "user.leave.private",
            (data: { channel: string; username: string }) => leavePrivate(data)
        );
        return () => {
            socket.off("user.leave.private", leavePrivate);
        };
    }, [socket, chat]);

    // When an user is added in a private channel
    useEffect(() => {
        async function joinPrivate(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex((user: any) => user === data.username);
            if (index === -1) {
                users.push(data.username);
                chat.setUsers(users);
            }
        }
        socket.on("user.join.private", (data: any) => joinPrivate(data));
        return () => {
            socket.off("user.join.private", joinPrivate);
        };
    }, [socket, chat]);

    // When channel type changed
    useEffect(() => {
        async function channelTypeUpdate(data: {
            channelName: string;
            channelType: string;
        }) {
            if (chat.channel === data.channelName) {
                chat.setChannelType(data.channelType);
            }
        }
        socket.on("chat.channelType.update", channelTypeUpdate);
        return () => {
            socket.off("chat.channelType.update", channelTypeUpdate);
        };
    }, [socket, chat]);

    return <>{children}</>;
};
