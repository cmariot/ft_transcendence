import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import "../CSS/Friends.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../Home/Chat/ChatParent";

export default function Friends() {
    let user = useContext(UserContext);
    let chat = useContext(ChatContext);

    const [newFriend, setNewFriend] = useState("");
    const [friends, setFriends] = useState(user.friends);
    const [blocked, setBlocked] = useState(user.blocked);

    async function toogleMenu(index: number) {
        let menus = document.getElementsByClassName("friend-menu");
        if (menus[index].classList.contains("friend-menu-display")) {
            menus[index].classList.remove("friend-menu-display");
        } else {
            for (var i = 0; i < menus.length; i++) {
                menus[i].classList.remove("friend-menu-display");
            }
            menus[index].classList.add("friend-menu-display");
        }
    }

    const addFriend = async (event: any) => {
        event.preventDefault();
        await axios
            .post("/api/profile/friends/add", {
                username: newFriend,
            })
            .then(function (response) {
                user.setFriends(response.data);
                setNewFriend("");
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    async function removeFriend(friendUsername: string, index: number) {
        await axios
            .post("/api/profile/friends/remove", {
                username: friendUsername,
            })
            .then(function (response) {
                user.setFriends(response.data);
                toogleMenu(index);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    }

    async function unblock(username: string) {
        await axios
            .post("/api/profile/unblock", { username: username })
            .then((response) => {
                user.setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function blockedUsersList() {
        if (user.blocked.length) {
            return (
                <section>
                    <>
                        <ul id="friend-list">
                            <h2>blocked list</h2>
                            {blocked.map((blocked, index) => (
                                <li className="friend blocked" key={index}>
                                    <img
                                        src={
                                            "/api/profile/" +
                                            blocked["username"] +
                                            "/image"
                                        }
                                        className="friend-profile-picture"
                                        alt="Friend's avatar"
                                    />
                                    <div className="friend-middle-div">
                                        <p className="friend-username">
                                            <b>{blocked["username"]}</b>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            unblock(blocked["username"])
                                        }
                                    >
                                        unblock
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                </section>
            );
        }
    }

    useEffect(() => {
        setFriends(user.friends);
    }, [user.friends, user.friendUpdate]);

    useEffect(() => {
        setBlocked(user.blocked);
    }, [user.blocked]);

    function displayStatus(status: string) {
        if (status === "Online") {
            return <div title="online" className="friend-status-online"></div>;
        } else if (status === "Offline") {
            return (
                <div title="offline" className="friend-status-offline"></div>
            );
        } else if (status === "In_Game") {
            return (
                <div title="in a game" className="friend-status-in-game"></div>
            );
        } else if (status === "MatchMaking") {
            return (
                <div
                    title="searching for a game"
                    className="friend-status-matchmaking"
                ></div>
            );
        }
    }

    const navigate = useNavigate();
    async function profile(username: string) {
        navigate("/profile/" + username);
    }

    async function blockUser(username: string, index: number) {
        toogleMenu(index);
        await axios
            .post("/api/profile/block", { username: username })
            .then(async (response) => {
                user.setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    async function directMessage(username: string, index: number) {
        let menus = document.getElementsByClassName("friend-menu");
        if (menus[index].classList.contains("friend-menu-display")) {
            menus[index].classList.remove("friend-menu-display");
        }
        navigate("/");
        await axios
            .post("/api/chat/direct-message", { username: username })
            .then((response) => {
                if (response.status === HttpStatusCode.NoContent) {
                    chat.startConversationWith(username);
                    const current =
                        document.getElementById("chat-your-channels");
                    const menu = document.getElementById("chat-create-private");
                    if (menu && current) {
                        current.style.display = "none";
                        menu.style.display = "flex";
                    }
                    return;
                } else {
                    const current =
                        document.getElementById("chat-your-channels");
                    const menu = document.getElementById("chat-conversation");
                    if (menu && current) {
                        current.style.display = "none";
                        menu.style.display = "flex";
                    }
                    chat.changeCurrentChannel(response.data.channelName);
                    chat.setCurrentChannelMessages(response.data.data.messages);
                    chat.setChannelOwner(response.data.data.channel_owner);
                    chat.changeCurrentChannelType("private");
                    chat.setCurrentChannelAdmins(
                        response.data.data.channel_admins
                    );
                    chat.setCurrentChannelMute(response.data.data.muted_users);
                    chat.setCurrentChannelBan(response.data.data.banned_users);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Voir ce qui est obligatoire au niveau du sujet a modif si necessaire
    // - Photo de profil des amis : Ok mais pas mis a jour automatiquement lorsqu'ils la changent
    // - Status : utiliser socket pour le mettre a jour automatiquement
    //
    // Menu /user
    // - Bouton invitation a jouer
    // - Bouton Direct Message : Redirection vers le chat + creation conversation
    // - Bouton Profile : Lien vers profil de l'ami (on doit voir son match-history et ses stats)
    // - [X] Supprimer l'ami (pas dans le sujet mais c'est fait)
    // - Bloquer
    return (
        <div id="friends">
            <aside id="add-friend">
                <h2>Add a new friend</h2>
                <form onSubmit={addFriend} autoComplete="off">
                    <input
                        type="text"
                        value={newFriend}
                        onChange={(event) => setNewFriend(event.target.value)}
                    />
                    <button type="submit">Add Friend</button>
                </form>
            </aside>
            <main id="friend-list-main">
                {friends.length === 0 ? (
                    <p>You have no friends yet ...</p>
                ) : (
                    <>
                        <ul id="friend-list">
                            <h2>Friends list</h2>
                            {friends.map((friend, index) => (
                                <li className="friend" key={index}>
                                    <div className="div-friend-list">
                                        <img
                                            src={
                                                "/api/profile/" +
                                                friend["username"] +
                                                "/image"
                                            }
                                            className="friend-profile-picture"
                                            alt="Friend's avatar"
                                        />
                                        <div className="friend-middle-div">
                                            {displayStatus(friend["status"])}
                                            <p className="friend-username">
                                                <b>{friend["username"]}</b>
                                            </p>
                                        </div>

                                        <button
                                            className="friend-profile-button"
                                            onClick={() => toogleMenu(index)}
                                        >
                                            Menu
                                        </button>
                                    </div>
                                    <menu className="friend-menu">
                                        <ul className="friend-menu-ul">
                                            <li className="friend-menu-li">
                                                <button className="friend-menu-button">
                                                    Invite to play (todo)
                                                </button>
                                            </li>
                                            <li className="friend-menu-li">
                                                <button
                                                    className="friend-menu-button"
                                                    onClick={() =>
                                                        directMessage(
                                                            friend["username"],
                                                            index
                                                        )
                                                    }
                                                >
                                                    Direct message
                                                </button>
                                            </li>
                                            <li className="friend-menu-li">
                                                <button
                                                    className="friend-menu-button"
                                                    onClick={() =>
                                                        profile(
                                                            friend["username"]
                                                        )
                                                    }
                                                >
                                                    Profile
                                                </button>
                                            </li>
                                            <li className="friend-menu-li">
                                                <button
                                                    className="friend-menu-button"
                                                    onClick={() =>
                                                        removeFriend(
                                                            friend["username"],
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove Friend
                                                </button>
                                            </li>
                                            <li className="friend-menu-li">
                                                <button
                                                    className="friend-menu-button"
                                                    onClick={() =>
                                                        blockUser(
                                                            friend["username"],
                                                            index
                                                        )
                                                    }
                                                >
                                                    Block
                                                </button>
                                            </li>
                                        </ul>
                                    </menu>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </main>
            {blockedUsersList()}
        </div>
    );
}
