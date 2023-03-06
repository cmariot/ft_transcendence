import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { socket } from "../../../Contexts/WebsocketContext";
import { UserContext } from "../../../Contexts/UserProvider";

export const ChatContext = React.createContext({
    currentChannel: "",
    changeCurrentChannel: (newChannel: string) => {},
    currentChannelType: "",
    changeCurrentChannelType: (newChannelType: string) => {},
    currentChannelAdmins: [],
    setCurrentChannelAdmins: (updatedMessages: Array<string>) => {},
    currentChannelMute: [],
    setCurrentChannelMute: (updatedMessages: Array<string>) => {},
    currentChannelBan: [],
    setCurrentChannelBan: (updatedMessages: Array<string>) => {},
    currentChannelUsers: [],
    setCurrentChannelUsers: (updatedMessages: Array<string>) => {},
    targetChannel: "",
    setTargetChannel: (targetchannel: string) => {},
    previousMenu: "",
    setPreviousMenu: (previousMenu: string) => {},
    channelOwner: false,
    setChannelOwner: (newValue: boolean) => {},
    channelAdmin: false,
    setChannelAdmin: (newValue: boolean) => {},
    userChannels: new Map<string, { channelType: string }>(),
    userPrivateChannels: new Map<string, { channelType: string }>(),
    availableChannels: new Map<string, { channelType: string }>(),
    updateUserChannels: (
        updatedChannels: Map<string, { channelType: string }>
    ) => {},
    updateUserPrivateChannels: (
        updatedChannels: Map<string, { channelType: string }>
    ) => {},
    updateAvailableChannels: (
        updatedChannels: Map<string, { channelType: string }>
    ) => {},
    currentChannelMessages: new Array<{ username: string; message: string }>(),
    setCurrentChannelMessages: (
        updatedMessages: Array<{ username: string; message: string }>
    ) => {},
    conversationUser: "",
    startConversationWith: (newChannel: string) => {},
    ban: false,
    setBan: (newValue: boolean) => {},
    channelDeleted: false,
    setChannelDeleted: (newValue: boolean) => {},
});

export const ChatParent = () => {
    let user = useContext(UserContext);

    const [currentChannel, changeCurrentChannel] = useState("");
    const [currentChannelType, changeCurrentChannelType] = useState("");

    const [targetChannel, setTargetChannel] = useState("");
    const [previousMenu, setPreviousMenu] = useState("channels");

    const [channelOwner, setChannelOwner] = useState(false);
    const [channelAdmin, setChannelAdmin] = useState(false);

    const [currentChannelAdmins, setCurrentChannelAdmins] = useState(
        new Array<string>()
    );
    const [currentChannelMute, setCurrentChannelMute] = useState(
        new Array<string>()
    );
    const [currentChannelBan, setCurrentChannelBan] = useState(
        new Array<string>()
    );
    const [currentChannelUsers, setCurrentChannelUsers] = useState(
        new Array<string>()
    );
    const [currentChannelMessages, setCurrentChannelMessages] = useState(
        new Array<{ username: string; message: string }>()
    );
    const [userChannels, updateUserChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [userPrivateChannels, updateUserPrivateChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [availableChannels, updateAvailableChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [conversationUser, startConversationWith] = useState("");
    const [firstLoad, setFirstLoad] = useState(true);
    const [ban, setBan] = useState(false);
    const [channelDeleted, setChannelDeleted] = useState(false);

    useEffect(() => {
        socket.on("newChannelAvailable", () => {
            setFirstLoad(!firstLoad);
        });
        socket.on("banUser", (socket) => {
            if (
                socket.username === user.username &&
                socket.channel === currentChannel
            ) {
                setFirstLoad(!firstLoad);
                let currentUserChannels = userChannels;
                let currentAvailableChannels = availableChannels;

                if (currentUserChannels.has(socket.channelName) === true) {
                    currentUserChannels.delete(socket.channelName);
                    updateUserChannels(currentUserChannels);
                }
                if (
                    currentAvailableChannels.has(socket.channelName) === false
                ) {
                    currentAvailableChannels.delete(socket.channelName);
                    updateAvailableChannels(currentAvailableChannels);
                }
                setBan(true);
            }
        });
        socket.on("kickUser", (socket) => {
            if (
                socket.username === user.username &&
                socket.channel === currentChannel
            ) {
                setFirstLoad(!firstLoad);
                setBan(true);
            }
        });
        socket.on("channelDeleted", (socket) => {
            if (socket.channel === currentChannel) {
                setChannelDeleted(true);
            }
        });
        socket.on("channelAdminUpdate", (socket) => {
            if (
                socket.channel === currentChannel &&
                socket.username === user.username
            ) {
                setChannelAdmin(socket.value);

                axios
                    .post("/api/chat/private/get_users", {
                        channelName: socket.channel,
                    })
                    .then((response) => {
                        setCurrentChannelUsers(response.data);
                    })
                    .catch((error) => console.log(error.data));
            }
        });
        socket.on("userLeaveChannel", (socket) => {
            let current_users: string[] = currentChannelUsers;
            let index = current_users.findIndex(
                (element) => element === socket.username
            );
            if (index !== -1) {
                current_users.splice(index, 1);
                setCurrentChannelUsers(current_users);
            }
            let current_admins: string[] = currentChannelAdmins;
            index = current_admins.findIndex(
                (element) => element === socket.username
            );
            if (index !== -1) {
                current_admins.splice(index, 1);
                setCurrentChannelAdmins(current_admins);
            }
        });

        socket.on("unban/unmute", (socket) => {
            if (socket.status === "mute") {
                setCurrentChannelMute(socket.users_list);
            } else if (socket.status === "ban") {
                setCurrentChannelBan(socket.users_list);
            }
        });
    });

    useEffect(() => {
        socket.on("newChatMessage", (socket) => {
            const socketChannel: string = socket.channel;
            if (socketChannel === currentChannel) {
                axios
                    .post("/api/chat/messages", { channelName: socket.channel })
                    .then((response) =>
                        setCurrentChannelMessages(response.data.messages)
                    )
                    .catch((error) => console.log(error.data));
            }
        });
    }, [currentChannel]);

    useEffect(() => {
        axios
            .get("/api/chat/channels")
            .then((response) => {
                let initialUserChannels = new Map<
                    string,
                    { channelType: string }
                >();
                for (let i = 0; i < response.data.userChannels.length; i++) {
                    if (
                        response.data.userChannels[i].channelName &&
                        response.data.userChannels[i]
                    ) {
                        initialUserChannels.set(
                            response.data.userChannels[i].channelName,
                            response.data.userChannels[i]
                        );
                    }
                }
                updateUserChannels(initialUserChannels);
                let initialUserPrivateChannels = new Map<
                    string,
                    { channelType: string }
                >();
                for (
                    let i = 0;
                    i < response.data.userPrivateChannels.length;
                    i++
                ) {
                    if (
                        response.data.userPrivateChannels[i].channelName &&
                        response.data.userPrivateChannels[i]
                    ) {
                        initialUserPrivateChannels.set(
                            response.data.userPrivateChannels[i].channelName,
                            response.data.userPrivateChannels[i]
                        );
                    }
                }
                updateUserPrivateChannels(initialUserPrivateChannels);
                let initialAvailableChannels = new Map<
                    string,
                    { channelType: string }
                >();
                for (
                    let i = 0;
                    i < response.data.availableChannels.length;
                    i++
                ) {
                    if (
                        response.data.availableChannels[i].channelName &&
                        response.data.availableChannels[i]
                    ) {
                        initialAvailableChannels.set(
                            response.data.availableChannels[i].channelName,
                            response.data.availableChannels[i]
                        );
                    }
                }
                updateAvailableChannels(initialAvailableChannels);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }, [firstLoad, user.blocked]);

    const value = {
        currentChannel,
        changeCurrentChannel,
        currentChannelType,
        changeCurrentChannelType,
        currentChannelAdmins,
        setCurrentChannelAdmins,
        currentChannelMute,
        setCurrentChannelMute,
        currentChannelBan,
        setCurrentChannelBan,
        currentChannelUsers,
        setCurrentChannelUsers,
        targetChannel,
        setTargetChannel,
        previousMenu,
        setPreviousMenu,
        channelOwner,
        setChannelOwner,
        channelAdmin,
        setChannelAdmin,
        userChannels,
        userPrivateChannels,
        availableChannels,
        updateUserChannels,
        updateUserPrivateChannels,
        updateAvailableChannels,
        currentChannelMessages,
        setCurrentChannelMessages,
        conversationUser,
        startConversationWith,
        ban,
        setBan,
        channelDeleted,
        setChannelDeleted,
    };

    return (
        <ChatContext.Provider value={value as any}>
            <div id="app-content">
                <Outlet />
            </div>
        </ChatContext.Provider>
    );
};