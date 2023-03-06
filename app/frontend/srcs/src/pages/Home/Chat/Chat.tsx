import { useState } from "react";
import YourChannels from "./YourChannels";
import ChannelsList from "./ChannelsList";
import CreateChannel from "./CreateChannel";
import ChatConv from "./ChatConv";
import JoinProtected from "./JoinProtectedChannel";
import CreatePrivate from "./CreatePrivate";
import EditChannelPassword from "./EditChannelPassword";
import EditAdmins from "./EditAdmins";
import BanUser from "./BanUser";
import MuteUser from "./MuteUser";
import KickUser from "./KickUser";
import AddUser from "./AddUser";
import "../../../styles/Chat.css";

export const CHANNELS_LIST = "CHANNELS_LIST";
export const JOINPROTECTED = "";
export const CREATECHANNEL = "";
export const CREATEPRIVATE = "";
export const CHATCONV = "";
export const EDITCHANNELPASSWORD = "";
export const EDITADMINS = "";
export const ADDUSER = "";
export const BANUSER = "";
export const KICKUSER = "";
export const MUTEUSER = "";
// List of menus for the chat, by default all are hidden except 'YourChannels'
const Chat = () => {
    const [currentMenu, setCurrentMenu] = useState<string | null>(null);

    const handleChangeCurrentMenu = (newCurrentMenu: string | null) => {
        setCurrentMenu(newCurrentMenu);
    };

    return (
        <div id="chat">
            {(currentMenu === null || currentMenu === "YourChannels") && (
                <YourChannels onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "ChannelsList" && (
                <ChannelsList onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "JoinProtected" && (
                <JoinProtected onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "CreateChannel" && (
                <CreateChannel onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "CreatePrivate" && (
                <CreatePrivate onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "ChatConv" && (
                <ChatConv onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "EditChannelPassword" && (
                <EditChannelPassword onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "EditAdmins" && (
                <EditAdmins onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "AddUser" && (
                <AddUser onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "KickUser" && (
                <KickUser onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "BanUser" && (
                <BanUser onChangeMenu={handleChangeCurrentMenu} />
            )}
            {currentMenu === "MuteUser" && (
                <MuteUser onChangeMenu={handleChangeCurrentMenu} />
            )}
        </div>
    );
};

export default Chat;
