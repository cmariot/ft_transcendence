import { useContext, useEffect, useState } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../contexts/UserProvider";
import FriendMenu from "./FriendMenu";
import axios from "axios";

export default function FriendsList() {
    let user = useContext(UserContext);
    let [showMenu, setShowMenu] = useState("");

    async function toogleMenu(friend: string) {
        if (showMenu === friend) {
            closeMenu();
        } else {
            setShowMenu(friend);
        }
    }

    async function closeMenu() {
        setShowMenu("");
    }

    function displayStatus(status: string) {
        if (status === "Online") {
            return <div title="online" className="friend-status-online" />;
        } else if (status === "Offline") {
            return <div title="offline" className="friend-status-offline" />;
        } else if (status === "In_Game") {
            return <div title="in a game" className="friend-status-in-game" />;
        } else if (status === "MatchMaking") {
            return (
                <div
                    title="searching for a game"
                    className="friend-status-matchmaking"
                />
            );
        }
    }

    useEffect(() => {
        (async () => {
            for (let i = 0; i < user.friends.length; i++) {
                if (!user.friends[i].avatar) {
                    try {
                        const url =
                            "/api/profile/" +
                            user.friends[i].username +
                            "/image";
                        const avatarResponse = await axios.get(url, {
                            responseType: "blob",
                        });
                        if (avatarResponse.status === 200) {
                            var imageUrl = URL.createObjectURL(
                                avatarResponse.data
                            );
                            user.friends[i].avatar = imageUrl;
                        } else {
                            user.friends[i].avatar = url;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        })();
    }, [user.friends, user.isLogged]);

    return (
        <ul id="friend-list">
            <h2>Friends list</h2>
            {user.friends.map((friend, index) => (
                <li className="friend" key={index}>
                    <div className="div-friend-list">
                        <img
                            src={friend.avatar}
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
                            onClick={() => toogleMenu(friend.username)}
                        >
                            Menu
                        </button>
                    </div>
                    {showMenu === friend.username && (
                        <FriendMenu friend={friend} closeMenu={closeMenu} />
                    )}
                </li>
            ))}
        </ul>
    );
}
