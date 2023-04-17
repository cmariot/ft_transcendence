import { useContext } from "react";
import { ChatContext } from "../../../../contexts/chat/ChatContext";

const AdminPannel = () => {
    const chat = useContext(ChatContext);

    if (chat.channelType === "private") {
        return (
            <>
                <button onClick={() => chat.setPage("MuteUser")}>
                    mute an user
                </button>
                <button onClick={() => chat.setPage("AddUser")}>
                    users list
                </button>
            </>
        );
    } else if (
        chat.channelType === "protected" ||
        chat.channelType === "public"
    ) {
        return (
            <>
                <button onClick={() => chat.setPage("MuteUser")}>
                    mute an user
                </button>
                <button onClick={() => chat.setPage("KickUser")}>
                    kick an user
                </button>
                <button onClick={() => chat.setPage("BanUser")}>
                    ban an user
                </button>
            </>
        );
    } else return null;
};

export default AdminPannel;
