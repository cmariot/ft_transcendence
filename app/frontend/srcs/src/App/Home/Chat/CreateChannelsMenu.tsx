import { ChangeEvent, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";

const CreateChannelMenu = () => {
    const [newChannelName, setNewChannelName] = useState("");

    function handleNewChannelNameChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-channel-name") {
            setNewChannelName(value);
        }
    }

    const submitCreateChannelForm = async (event: any) => {
        event.preventDefault();
        await axios
            .post("/api/chat/create-channel", {
                channelName: newChannelName,
            })
            .then(function () {
                setNewChannelName("");
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <menu id="chat-create-channel">
            <form>
                <input
                    id="new-channel-name"
                    type="text"
                    placeholder="New Channel"
                    value={newChannelName}
                    onChange={(event) => handleNewChannelNameChange(event)}
                    autoComplete="off"
                    required
                />
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Create Channel"
                    onClick={(e) => submitCreateChannelForm(e)}
                />
            </form>
        </menu>
    );
};
export default CreateChannelMenu;
