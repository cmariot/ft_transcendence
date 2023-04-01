import { useContext } from "react";
import { ChatContext } from "../../../../contexts/chat/ChatContext";

const OwnerPannel = () => {
    const chat = useContext(ChatContext);

    if (chat.channelType === "private") {
        return (
            <button onClick={() => chat.setPage("EditAdmins")}>
                edit channel's administrators
            </button>
        );
    } else if (
        chat.channelType === "public" ||
        chat.channelType === "protected"
    ) {
        return (
            <>
                <button onClick={() => chat.setPage("EditChannelPassword")}>
                    edit channel's password
                </button>
                <button onClick={() => chat.setPage("EditAdmins")}>
                    edit channel's administrators
                </button>
            </>
        );
    } else {
        return null;
    }
};

export default OwnerPannel;
