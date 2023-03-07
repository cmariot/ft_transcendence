import { useContext } from "react";
import { ChatContext } from "../../../../Contexts/ChatProvider";

const OwnerPannel = () => {
    const chat = useContext(ChatContext);

    if (chat.channelType === "privateChannel") {
        return <button>edit channel's administrators</button>;
    } else if (
        chat.channelType === "public" ||
        chat.channelType === "protected"
    ) {
        return (
            <>
                <button>edit channel's password</button>
                <button>edit channel's administrators</button>
            </>
        );
    } else {
        return null;
    }
};

export default OwnerPannel;
