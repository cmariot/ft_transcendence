import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { UserContext } from "../../App";
import { clear } from "console";

const CreatePrivateMenu = () => {
    let user = useContext(UserContext);
    enum ChannelType {
        PRIVATE = "private",
        PUBLIC = "public",
        PROTECTED = "protected",
    }

    const [newConversationlName, setNewConversationName] = useState("");
    const [newConversationUsers, setConversationsUsers] = useState<string[]>(
        []
    );

    function handleNewConversationNameChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === "new-conversation-name") {
            setNewConversationName(value);
        }
    }

    function addPeopleToConv(event: any, friend: any, index: number) {
        event.preventDefault();
        let selected_user =
            document.getElementsByClassName("chat-friends-list");
        if (selected_user[index].classList.contains("user-selected")) {
            selected_user[index].classList.remove("user-selected");
        } else {
            selected_user[index].classList.add("user-selected");
        }
        const people = newConversationUsers;

        const pos = people.indexOf(friend.username, 0);
        if (pos !== -1) {
            people.splice(pos, 1);
        } else {
            people.push(friend.username);
        }
        setConversationsUsers(people);
    }

    function clearSelectedList() {
        let selected_user =
            document.getElementsByClassName("chat-friends-list");
        let i = 0;
        while (i < user.friends.length) {
            if (
                selected_user[i] &&
                selected_user[i].classList.contains("user-selected")
            ) {
                selected_user[i].classList.remove("user-selected");
            }
            i++;
        }
        setNewConversationName("");
        setConversationsUsers([]);
    }

    const submitCreateConversationForm = async (event: any) => {
        event.preventDefault();
        if (newConversationlName.length === 0) {
            alert("You must set a name for your new conversation");
            return;
        }
        await axios
            .post("/api/chat/create/private", {
                channelName: newConversationlName,
                channelType: ChannelType.PRIVATE,
                allowed_users: newConversationUsers,
            })
            .then(function () {
                clearSelectedList();
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    function closeCreateChannelMenu() {
        const menu = document.getElementById("chat-menu");
        const createChannel = document.getElementById("chat-create-private");
        if (menu && createChannel) {
            menu.style.display = "flex";
            createChannel.style.display = "none";
        }
        clearSelectedList();
    }

    return (
        <menu id="chat-create-private" className="chat-section">
            <header className="chat-header">
                <p>New private conversation</p>
                <button onClick={closeCreateChannelMenu}>cancel</button>
            </header>

            <form id="chat-create-channel-form" className="chat-main">
                <input
                    id="new-conversation-name"
                    type="text"
                    placeholder="Conversation's name"
                    value={newConversationlName}
                    onChange={handleNewConversationNameChange}
                    autoComplete="off"
                    required
                />

                <h4>Add people to your conversation</h4>
                <ul>
                    {user.friends.map((friend, index) => (
                        <button
                            className="friend chat-friends-list"
                            key={index}
                            onClick={(event) =>
                                addPeopleToConv(
                                    event,
                                    user.friends[index],
                                    index
                                )
                            }
                        >
                            <img
                                src={
                                    "/api/profile/" +
                                    friend["username"] +
                                    "/image"
                                }
                                className="friend-profile-picture chat-friends-picture"
                                alt="Friend's avatar"
                            />
                            <div className="friend-middle-div chat-midle-div">
                                <p className="friend-username">
                                    <b>{friend["username"]}</b>
                                </p>
                                <p className="friend-status">
                                    {friend["status"]}
                                </p>
                            </div>
                        </button>
                    ))}
                </ul>
            </form>
            <div id="chat-create-button" className="chat-footer">
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Start Chatting"
                    onClick={submitCreateConversationForm}
                />
            </div>
        </menu>
    );
};

export default CreatePrivateMenu;
