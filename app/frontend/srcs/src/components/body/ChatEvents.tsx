import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import axios from "axios";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);

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

    return <>{children}</>;
};
