import React, { useEffect, useState } from "react";
import AppNavBar from "../../AppNavBar";
import { Outlet } from "react-router-dom";
import AppFooter from "../../AppFooter";
import axios from "axios";

export const ChatContext = React.createContext({
    currentChannel: "General",
    changeCurrentChannel: (newChannel: string) => {},

    availableChannels: new Map<string, { channelType: string }>(),
    updateAvailableChannels: (
        updatedChannels: Map<string, { channelType: string }>
    ) => {},

    currentChannelMessages: new Array<{ username: string; message: string }>(),
    setCurrentChannelMessages: (
        updatedMessages: Array<{ username: string; message: string }>
    ) => {},
});

export const ChatParent = () => {
    const [currentChannel, changeCurrentChannel] = useState("General");

    const [currentChannelMessages, setCurrentChannelMessages] = useState(
        new Array<{ username: string; message: string }>()
    );

    const [availableChannels, updateAvailableChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());

    useEffect(() => {
        axios
            .get("/api/chat/channels")
            .then((response) => {
                let initialChannels = new Map<
                    string,
                    { channelType: string }
                >();
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i] && response.data[i].channelName) {
                        initialChannels.set(
                            response.data[i].channelName,
                            response.data[i]
                        );
                    }
                }
                updateAvailableChannels(initialChannels);
            })
            .catch((error) => {
                console.log(error.response);
            });
        axios
            .post("/api/chat/connect", { channelName: "General" })
            .then(function (response) {
                setCurrentChannelMessages(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const value = {
        currentChannel,
        changeCurrentChannel,
        availableChannels,
        updateAvailableChannels,
        currentChannelMessages,
        setCurrentChannelMessages,
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
