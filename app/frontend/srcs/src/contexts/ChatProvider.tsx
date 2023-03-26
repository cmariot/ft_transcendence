import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserProvider";

export type ChatContextType = {
    channel: string;
    channelType: string;
    admins: Array<string>;
    users: Array<string>;
    messages: Array<string>;
    mutedUsers: Array<string>;
    bannedUsers: Array<string>;
    targetChannel: string;
    isChannelOwner: boolean;
    isChannelAdmin: boolean;
    userChannels: Map<string, { channelType: string }>;
    userPrivateChannels: Map<string, { channelType: string }>;
    availableChannels: Map<string, { channelType: string }>;
    directMessageUser: string;
    isBan: boolean;
    isChannelDeleted: boolean;
    page: string;
    showMenu: boolean;
};

export const ChatContext = createContext({
    channel: "",
    setChannel: (newChannel: string) => {},
    channelType: "",
    setChannelType: (newChannelType: string) => {},
    admins: new Array<string>(),
    setAdmins: (updatedMessages: Array<string>) => {},
    mutedUsers: new Array<string>(),
    setmutedUsers: (updatedMessages: Array<string>) => {},
    bannedUsers: new Array<string>(),
    setbannedUsers: (updatedMessages: Array<string>) => {},
    users: new Array<string>(),
    setUsers: (updatedMessages: Array<string>) => {},
    targetChannel: "",
    setTargetChannel: (targetchannel: string) => {},
    isChannelOwner: false,
    setisChannelOwner: (newValue: boolean) => {},
    isChannelAdmin: false,
    setisChannelAdmin: (newValue: boolean) => {},
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
    messages: new Array<{ username: string; message: string }>(),
    setMessages: (
        updatedMessages: Array<{ username: string; message: string }>
    ) => {},
    directMessageUser: "",
    setDirectMessageUser: (newChannel: string) => {},
    isBan: false,
    setIsBan: (newValue: boolean) => {},
    isChannelDeleted: false,
    setisChannelDeleted: (newValue: boolean) => {},
    page: "",
    setPage: (newValue: string) => {},
    showMenu: false,
    toogleMenu: () => {},
    closeMenu: () => {},
    leaveChannel: (channel: string, channelType: string) => {},
});

type ChatProviderProps = { children: JSX.Element | JSX.Element[] };
const ChatProvider = ({ children }: ChatProviderProps) => {
    const user = useContext(UserContext);

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

    useEffect(() => {
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
        if (user.isLogged) {
            (async () => {
                try {
                    const [channelsResponse] = await Promise.all([
                        axios.get("/api/chat/channels"),
                    ]);

                    if (channelsResponse.status === 200) {
                        updateUserChannels(
                            arrayToMap(channelsResponse.data.userChannels)
                        );
                        updateUserPrivateChannels(
                            arrayToMap(
                                channelsResponse.data.userPrivateChannels
                            )
                        );
                        updateAvailableChannels(
                            arrayToMap(channelsResponse.data.availableChannels)
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [user.isLogged]);

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
