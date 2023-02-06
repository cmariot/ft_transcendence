import axios from "axios";
import { useState, useEffect } from "react";
import "../CSS/Friends.css";

export default function Friends(props) {
    const [newFriend, setNewFriend] = useState("");
    const [friends, setFriends] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const addFriend = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/profile/friend", {
                username: newFriend,
            })
            .then(function () {
                setRefresh(!refresh);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    async function toogleMenu(index) {
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

    async function removeFriend(friendUsername: string) {
        await axios
            .post("/api/profile/friend/delete", {
                username: friendUsername,
            })
            .then(function () {
                setRefresh(!refresh);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        const fetchData = async () => {
            await axios
                .get("https://localhost:8443/api/profile/friend")
                .then(function (response) {
                    setFriends(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        fetchData();
    }, [refresh]);

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
            <main id="friend-list">
                <h2>Friends list</h2>
                <ul id="friend-list">
                    {friends.map((friend, index) => (
                        <li className="friend" key={index}>
                            <img
                                src={"/api/profile/" + friend + "/image"}
                                className="friend-profile-picture"
                            />
                            <div className="friend-middle-div">
                                <p className="friend-username">
                                    <b>{friend}</b>
                                </p>
                                <p className="friend-status">(online)</p>
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
                                                    removeFriend(friend)
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
            </main>
        </div>
    );
}
