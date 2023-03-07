import { useContext } from "react";
import { ChatContext } from "../../../../Contexts/ChatProvider";

const AdminPannel = () => {
    const chat = useContext(ChatContext);

    if (chat.channelType === "privateChannel") {
        return (
            <>
                <button>mute an user</button>
                <button>users list</button>
            </>
        );
    } else if (
        chat.channelType === "protected" ||
        chat.channelType === "public"
    ) {
        return (
            <>
                <button>mute an user</button>
                <button>kick an user</button>
                <button>ban an user</button>
            </>
        );
    } else return null;
};

export default AdminPannel;
