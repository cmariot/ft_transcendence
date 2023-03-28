import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";
import { MenuContext } from "../../contexts/MenuProviders";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);

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
            } catch (error: any) {
                menu.displayError(error.response.data.message);
            }
        }
        socket.on("chat.new.channel", updateChannels);
        return () => {
            socket.off("chat.new.channel", updateChannels);
        };
    }, [chat, socket, menu]);

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
                            menu.displayError(error.response.data.message);
                        });
                }
            }
        }
        socket.on("chat.new.admin", updateAdmins);
        return () => {
            socket.off("chat.new.admin", updateAdmins);
        };
    }, [chat, socket, user, menu]);

    // When a admin is removed
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
                        admins.splice(index, 1);
                        chat.setAdmins(admins);
                    }
                }
                if (data.username === user.username) {
                    try {
                        const connectResponse = await axios.post(
                            "/api/chat/connect",
                            { channelName: data.channel }
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
        socket.on("chat.remove.admin", updateAdmins);
        return () => {
            socket.off("chat.remove.admin", updateAdmins);
        };
    }, [chat, socket, user, menu]);

    // When an user is mute
    useEffect(() => {
        async function updateMute(data: { channel: string; username: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let muted = chat.mutedUsers;
                    if (
                        muted.findIndex((mute) => mute === data.username) === -1
                    ) {
                        muted.push(data.username);
                        chat.setmutedUsers(muted);
                    }
                }
            }
        }
        socket.on("chat.user.mute", updateMute);
        return () => {
            socket.off("chat.user.mute", updateMute);
        };
    }, [chat, socket, user]);

    // When an user is unmute
    useEffect(() => {
        async function updateMute(data: { channel: string; username: string }) {
            if (chat.channel === data.channel) {
                if (
                    chat.isChannelAdmin === true ||
                    chat.isChannelOwner === true
                ) {
                    let muted = chat.mutedUsers;
                    let index = muted.findIndex(
                        (muted) => muted === data.username
                    );
                    if (index !== -1) {
                        muted.splice(index, 1);
                        chat.setmutedUsers(muted);
                    }
                }
            }
        }
        socket.on("chat.user.unmute", updateMute);
        return () => {
            socket.off("chat.user.unmute", updateMute);
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
                    if (
                        banned.findIndex((ban) => ban === data.username) === -1
                    ) {
                        banned.push(data.username);
                        chat.setmutedUsers(banned);
                    }
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
                        banned.splice(index, 1);
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
                            menu.displayError(error.response.data.message);
                        });
                }
            }
        }
        socket.on("chat.user.kicked", updateUsers);
        return () => {
            socket.off("chat.user.kicked", updateUsers);
        };
    }, [chat, socket, user, menu]);

    // When an user leave a private channel
    useEffect(() => {
        async function updateUsers(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex((muted) => muted === data.username);
            if (index !== -1) {
                users.splice(index, 1);
                chat.setUsers(users);
            }
        }
        socket.on("user.leave.private", updateUsers);
        return () => {
            socket.off("user.leave.private", updateUsers);
        };
    }, [chat, socket]);

    // When an user is added in a private channel
    useEffect(() => {
        async function updateUsers(data: {
            channel: string;
            username: string;
        }) {
            let users = chat.users;
            let index = users.findIndex((user) => user === data.username);
            if (index === -1) {
                users.push(data.username);
                chat.setUsers(users);
            }
        }
        socket.on("user.join.private", updateUsers);
        return () => {
            socket.off("user.join.private", updateUsers);
        };
    }, [chat, socket]);

    return <>{children}</>;
};
