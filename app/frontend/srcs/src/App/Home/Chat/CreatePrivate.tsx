import { ChangeEvent, useContext, useState } from "react";
import "../../CSS/Chat.css";
import axios from "axios";
import { UserContext } from "../../App";
import { ChatContext } from "./ChatParent";

const CreatePrivate = () => {
    let user = useContext(UserContext);
    let chat = useContext(ChatContext);

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
            .then(async function () {
                await axios
                    .post("/api/chat/connect", {
                        channelName: newConversationlName,
                    })
                    .then(function (response) {
                        console.log(response.data);
                        chat.changeCurrentChannel(newConversationlName);
                        chat.setCurrentChannelMessages(response.data);
                        clearSelectedList();
                        //const createChannel = document.getElementById(
                        //    "chat-create-private"
                        //);

                        //const chatConv = document.getElementById("chat");
                        //if (createChannel && chatConv) {
                        //    createChannel.style.display = "none";
                        //    chatConv.style.display = "flex";
                        //}
                    })
                    .catch(function (error) {
                        alert(error.response.data.message);
                    });
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    function returnToYourChannels() {
        const current = document.getElementById("chat-create-private");
        const menu = document.getElementById("chat-your-channels");
        if (menu && current) {
            current.style.display = "none";
            menu.style.display = "flex";
        }
        clearSelectedList();
    }

    return (
        <menu id="chat-create-private" className="chat-menu">
            <header className="chat-header">
                <p className="chat-header-tittle">New private conversation</p>
                <button onClick={returnToYourChannels}>cancel</button>
            </header>
            <section className="chat-section">
                <form id="chat-create-private-form" className="chat-main">
                    <input
                        id="new-conversation-name"
                        type="text"
                        placeholder="Conversation's name"
                        value={newConversationlName}
                        onChange={handleNewConversationNameChange}
                        autoComplete="off"
                        required
                    />
                    <h4>Add friends to your conversation</h4>
                    <ul id="chat-friend-list">
                        {user.friends.map((friend, index) => (
                            <button
                                className="chat-friends-list"
                                key={index}
                                onClick={(event) =>
                                    addPeopleToConv(
                                        event,
                                        user.friends[index],
                                        index
                                    )
                                }
                            >
                                <div className="friend-list-profile">
                                    <img
                                        src={
                                            "/api/profile/" +
                                            friend["username"] +
                                            "/image"
                                        }
                                        className="chat-friends-picture"
                                        alt="Friend's avatar"
                                    />
                                    <div className="chat-midle-div">
                                        <p className="friend-username">
                                            <b>{friend["username"]}</b>
                                        </p>
                                        <p className="friend-status">
                                            {friend["status"]}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </ul>
                </form>
            </section>
            <footer className="chat-footer">
                <input
                    id="submit-private"
                    className="button"
                    type="submit"
                    value="chat"
                    onClick={submitCreateConversationForm}
                />
            </footer>
        </menu>
    );
};

export default CreatePrivate;
