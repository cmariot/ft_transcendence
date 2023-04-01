import { createContext } from "react";

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
