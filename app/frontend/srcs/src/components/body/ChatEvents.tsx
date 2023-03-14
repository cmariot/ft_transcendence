import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { SocketContext } from "../../contexts/SocketProvider";
import { ChatContext } from "../../contexts/ChatProvider";
import axios from "axios";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
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

    // When a new channel il available
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

    return <>{children}</>;
};
