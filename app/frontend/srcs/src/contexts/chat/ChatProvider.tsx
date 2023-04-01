import { useState } from "react";
import { ChatContext } from "./ChatContext";

type ChatProviderProps = { children: JSX.Element | JSX.Element[] };
const ChatProvider = ({ children }: ChatProviderProps) => {
    const [channel, setChannel] = useState("");
    const [channelType, setChannelType] = useState("");
    const [messages, setMessages] = useState(
        new Array<{ username: string; message: string }>()
    );
    const [isChannelOwner, setisChannelOwner] = useState(false);
    const [isChannelAdmin, setisChannelAdmin] = useState(false);
    const [users, setUsers] = useState(new Array<string>());
    const [admins, setAdmins] = useState(new Array<string>());
    const [mutedUsers, setmutedUsers] = useState(new Array<string>());
    const [bannedUsers, setbannedUsers] = useState(new Array<string>());
    const [targetChannel, setTargetChannel] = useState("");
    const [userChannels, updateUserChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [userPrivateChannels, updateUserPrivateChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [availableChannels, updateAvailableChannels] = useState<
        Map<string, { channelType: string }>
    >(new Map<string, { channelType: string }>());
    const [directMessageUser, setDirectMessageUser] = useState("");
    const [isBan, setIsBan] = useState(false);
    const [isChannelDeleted, setisChannelDeleted] = useState(false);
    const [showMenu, setShownMenu] = useState(false);
    const [page, setPage] = useState("YourChannels");

    function toogleMenu() {
        setShownMenu((prevState) => !prevState);
    }

    function closeMenu() {
        setShownMenu(false);
    }

    function leaveChannel(channel: string, channelType: string) {
        if (channelType === "private" || channelType === "direct_message") {
            let channels = new Map<string, { channelType: string }>(
                userPrivateChannels
            );
            if (channels.delete(channel)) {
                updateUserPrivateChannels(channels);
            }
        } else {
            let channels = new Map<string, { channelType: string }>(
                userChannels
            );
            if (channels.delete(channel)) {
                updateUserChannels(channels);
                let availables = new Map<string, { channelType: string }>(
                    availableChannels
                );
                if (
                    !isChannelOwner &&
                    (channelType === "public" || channelType === "protected")
                ) {
                    updateAvailableChannels(
                        availables.set(channel, {
                            channelType: channelType,
                        })
                    );
                }
            }
        }
        setMessages([]);
        setChannel("");
        setChannelType("");
        setmutedUsers([]);
        setbannedUsers([]);
        closeMenu();
        setPage("YourChannels");
    }

    const value = {
        channel,
        setChannel,
        channelType,
        setChannelType,
        admins,
        setAdmins,
        mutedUsers,
        setmutedUsers,
        bannedUsers,
        setbannedUsers,
        users,
        setUsers,
        targetChannel,
        setTargetChannel,
        isChannelOwner,
        setisChannelOwner,
        isChannelAdmin,
        setisChannelAdmin,
        userChannels,
        userPrivateChannels,
        availableChannels,
        updateUserChannels,
        updateUserPrivateChannels,
        updateAvailableChannels,
        messages,
        setMessages,
        directMessageUser,
        setDirectMessageUser,
        isBan,
        setIsBan,
        isChannelDeleted,
        setisChannelDeleted,
        showMenu,
        toogleMenu,
        closeMenu,
        page,
        setPage,
        leaveChannel,
    };

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
};

export default ChatProvider;
