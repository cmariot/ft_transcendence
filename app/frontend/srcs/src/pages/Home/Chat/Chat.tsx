import { useContext, useEffect } from "react";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import ChatConv from "./ChatConv";
import JoinProtected from "./JoinProtectedChannel";
import CreatePrivate from "./CreatePrivate";
import EditChannelPassword from "./Settings/EditChannelPassword";
import EditAdmins from "./Settings/EditAdmins";
import BanUser from "./Settings/BanUser";
import MuteUser from "./Settings/MuteUser";
import KickUser from "./Settings/KickUser";
import AddUser from "./Settings/AddUser";
import "../../../styles/Chat.css";
import { ChatContext } from "../../../Contexts/ChatProvider";
import axios from "axios";

const Chat = () => {
    const chat = useContext(ChatContext);

    //useEffect(() => {
    //    (async () => {
    //        try {
    //            const [channelsResponse] = await Promise.all([
    //                axios.get("/api/chat/channels"),
    //            ]);

    //            if (channelsResponse.status === 200) {
    //                chat.updateUserChannels(
    //                    arrayToMap(channelsResponse.data.userChannels)
    //                );
    //                chat.updateUserPrivateChannels(
    //                    arrayToMap(channelsResponse.data.userPrivateChannels)
    //                );
    //                chat.updateAvailableChannels(
    //                    arrayToMap(channelsResponse.data.availableChannels)
    //                );
    //            }
    //        } catch (error) {}
    //    })();
    //}, []);

    return (
        <div id="chat">
            {chat.page === "YourChannels" && <YourChannels />}
            {chat.page === "ChannelsList" && <ChannelsList />}
            {chat.page === "JoinProtected" && <JoinProtected />}
            {chat.page === "CreateChannel" && <CreateChannel />}
            {chat.page === "CreatePrivate" && <CreatePrivate />}
            {chat.page === "ChatConv" && <ChatConv />}
            {chat.page === "EditChannelPassword" && <EditChannelPassword />}
            {chat.page === "EditAdmins" && <EditAdmins />}
            {chat.page === "AddUser" && <AddUser />}
            {chat.page === "KickUser" && <KickUser />}
            {chat.page === "BanUser" && <BanUser />}
            {chat.page === "MuteUser" && <MuteUser />}
        </div>
    );
};

export default Chat;
