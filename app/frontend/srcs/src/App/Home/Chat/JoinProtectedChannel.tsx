import { useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const JoinProtectedMenu = (props: any) => {
    const chat = useContext(ChatContext);
    const [password, setPassword] = useState("");

    function handleProtectedChange(event: any) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "password-protected-channel") {
            setPassword(value);
        }
    }

    async function submitProtectedForm(event: any) {
        event.preventDefault();
        await axios
            .post("/api/chat/join/protected", {
                channelName: props.channel,
                channelPassword: password,
            })
            .then((response) => {
                setPassword("");
                chat.changeCurrentChannel(props.channel);
                chat.setCurrentChannelMessages(response.data);
                var passwordMenu = document.getElementById(
                    "chat-join-protected"
                );
                var chatMain = document.getElementById("chat");
                if (passwordMenu && chatMain) {
                    passwordMenu.style.display = "none";
                    chatMain.style.display = "flex";
                }
            })
            .catch((error) => {
                setPassword("");
                alert(error.response.data.message);
            });
    }

    function closeChatMenu() {
        var passwordMenu = document.getElementById("chat-join-protected");
        var menu = document.getElementById("chat-menu");
        if (passwordMenu && menu) {
            menu.style.display = "flex";
            passwordMenu.style.display = "none";
        }
    }

    return (
        <menu id="chat-join-protected" className="chat-section">
            <header id="chat-protected-header" className="chat-header">
                <p id="chat-channel">{props.channel} password</p>
                <button onClick={closeChatMenu}>cancel</button>
            </header>
            <div id="chat-protected-channels" className="chat-main">
                <p>Enter the {props.channel}'s password :</p>
                <form onSubmit={submitProtectedForm}>
                    <input
                        type="password"
                        id="password-protected-channel"
                        placeholder="Password"
                        value={password}
                        onChange={handleProtectedChange}
                        autoComplete="off"
                        required
                    />
                </form>
            </div>

            <footer id="chat-protexted-buttons" className="chat-footer">
                <button
                    type="submit"
                    className="button"
                    onClick={submitProtectedForm}
                    value="Login"
                >
                    join
                </button>
            </footer>
        </menu>
    );
};
export default JoinProtectedMenu;
