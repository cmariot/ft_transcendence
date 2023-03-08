import { useContext } from "react";
import { ChatContext } from "../../../../Contexts/ChatProvider";
import axios from "axios";

const UserPannel = () => {
    const chat = useContext(ChatContext);

    function closeChat() {
        chat.setChannel("");
        chat.closeMenu();
        chat.setPage("YourChannels");
    }

    async function leaveChannel() {
        await axios
            .post("/api/chat/leave", { channelName: chat.channel })
            .then(function () {
                chat.leaveChannel(chat.channel, chat.channelType);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    }

    if (chat.isChannelOwner === true || chat.channelType === "private") {
        return (
            <>
                <button onClick={leaveChannel}>
                    leave this channel and delete it
                </button>
                <button onClick={closeChat}>return to channels list</button>
            </>
        );
    } else {
        return (
            <>
                <button onClick={leaveChannel}>leave</button>
                <button onClick={closeChat}>return to channels list</button>
            </>
        );
    }
};

export default UserPannel;
