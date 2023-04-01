import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/sockets/SocketProvider";
import { ChatContext } from "../../contexts/chat/ChatContext";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";
import { updateChannels } from "./functions/updateChannels";
import { deleteChannels } from "./functions/deleteChannel";
import { unmute } from "./functions/unmute";
import { unban } from "./functions/unBan";
import { leavePrivate } from "./functions/leavePrivate";
import { kick } from "./functions/kick";
import { mute } from "./functions/mute";
import { removeAdmins } from "./functions/removeAdmin";
import { addAdmins } from "./functions/addAdmin";
import { updateMessages } from "./functions/updateMessages";
import { ban } from "./functions/ban";
import { joinPrivate } from "./functions/joinPrivate";

type ChatEventsProps = { children: JSX.Element | JSX.Element[] };
export const ChatEvents = ({ children }: ChatEventsProps) => {
    const socket = useContext(SocketContext);
    const chat = useContext(ChatContext);
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);

    // When a new channel is available
    useEffect(() => {
        socket.on("chat.new.channel", () => updateChannels(chat, menu));
        return () => {
            socket.off("chat.new.channel", updateChannels);
        };
    }, [chat, socket, menu]);

    // When a channel is deleted
    useEffect(() => {
        socket.on("chat.deleted.channel", (data: any) =>
            deleteChannels(data, chat)
        );
        return () => {
            socket.off("chat.deleted.channel", deleteChannels);
        };
    }, [chat, socket]);

    // When new message
    useEffect(() => {
        socket.on("chat.message", () => updateMessages(chat));
        return () => {
            socket.off("chat.message", updateMessages);
        };
    }, [chat, socket]);

    // When a new admin is add
    useEffect(() => {
        socket.on("chat.new.admin", (data: any) =>
            addAdmins(data, chat, user, menu)
        );
        return () => {
            socket.off("chat.new.admin", addAdmins);
        };
    }, [chat, socket, user, menu]);

    // When a admin is removed
    useEffect(() => {
        socket.on("chat.remove.admin", (data: any) =>
            removeAdmins(data, chat, user, menu)
        );
        return () => {
            socket.off("chat.remove.admin", removeAdmins);
        };
    }, [chat, socket, user, menu]);

    // When an user is mute
    useEffect(() => {
        socket.on("chat.user.mute", (data: any) => mute(data, chat));
        return () => {
            socket.off("chat.user.mute", mute);
        };
    }, [chat, socket, user]);

    // When an user is unmute
    useEffect(() => {
        socket.on("chat.user.unmute", (data: any) => unmute(data, chat));
        return () => {
            socket.off("chat.user.unmute", unmute);
        };
    }, [chat, socket, user]);

    // When an user is banned
    useEffect(() => {
        socket.on("chat.user.ban", (data: any) => ban(data, user, chat));
        return () => {
            socket.off("chat.user.ban", ban);
        };
    }, [chat, socket, user]);

    // When an user is unban
    useEffect(() => {
        socket.on("chat.user.unban", (data: any) => unban(data, user, chat));
        return () => {
            socket.off("chat.user.unban", unban);
        };
    }, [chat, socket, user]);

    // When an user is kicked
    useEffect(() => {
        socket.on("chat.user.kicked", (data: any) =>
            kick(data, chat, user, menu)
        );
        return () => {
            socket.off("chat.user.kicked", kick);
        };
    }, [chat, socket, user, menu]);

    // When an user leave a private channel
    useEffect(() => {
        socket.on("user.leave.private", (data: any) =>
            leavePrivate(data, chat)
        );
        return () => {
            socket.off("user.leave.private", leavePrivate);
        };
    }, [chat, socket]);

    // When an user is added in a private channel
    useEffect(() => {
        socket.on("user.join.private", (data: any) => joinPrivate(data, chat));
        return () => {
            socket.off("user.join.private", joinPrivate);
        };
    }, [chat, socket]);

    return <>{children}</>;
};
