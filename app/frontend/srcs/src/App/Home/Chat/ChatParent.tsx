import React, { useEffect, useState } from "react";
import AppNavBar from "../../AppNavBar";
import { Outlet } from "react-router-dom";
import AppFooter from "../../AppFooter";
import axios from "axios";
import { socket } from "../../../Contexts/WebsocketContext";

export const ChatContext = React.createContext({
    currentChannel: "General",
    changeCurrentChannel: (newChannel: string) => {},

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
});

export const ChatParent = () => {
    const [currentChannel, changeCurrentChannel] = useState("");
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

    useEffect(() => {
        socket.on("newChannelAvailable", () => {
            setFirstLoad(!firstLoad);
        });
    });

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
    }, [firstLoad]);

    const value = {
        currentChannel,
        changeCurrentChannel,
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
    };

    return (
        <ChatContext.Provider value={value as any}>
            <AppNavBar />
            <div id="app-content">
                <Outlet />
            </div>
            <AppFooter />
        </ChatContext.Provider>
    );
};
