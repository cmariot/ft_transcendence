import axios from "axios";
import { useState, useEffect, useContext } from "react";
import "../CSS/Friends.css";
import { UserContext } from "../App";

export default function Friends(props: any) {
    let user = useContext(UserContext);
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
                                <li className="friend" key={index}>
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
    }, [user.friends]);

    useEffect(() => {
        setBlocked(user.blocked);
    }, [user.blocked]);

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
                <form onSubmit={addFriend}>
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
                                        <p className="friend-username">
                                            <b>{friend["username"]}</b>
                                        </p>
                                        <p className="friend-status">
                                            {friend["status"]}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            className="friend-profile-button"
                                            onClick={() => toogleMenu(index)}
                                        >
                                            Menu
                                        </button>
                                        <menu className="friend-menu">
                                            <ul className="friend-menu-ul">
                                                <li className="friend-menu-li">
                                                    Invite to play
                                                </li>
                                                <li className="friend-menu-li">
                                                    Direct Message
                                                </li>
                                                <li className="friend-menu-li">
                                                    Profile
                                                </li>
                                                <li className="friend-menu-li">
                                                    <button
                                                        onClick={() =>
                                                            removeFriend(
                                                                friend[
                                                                    "username"
                                                                ],
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove Friend
                                                    </button>
                                                </li>
                                                <li className="friend-menu-li">
                                                    Block
                                                </li>
                                            </ul>
                                        </menu>
                                    </div>
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
