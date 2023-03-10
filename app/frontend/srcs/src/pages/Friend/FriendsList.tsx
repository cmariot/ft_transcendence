import { useContext, useState } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../contexts/UserProvider";
import FriendMenu from "./FriendMenu";

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

    return (
        <ul id="friend-list">
            <h2>Friends list</h2>
            {user.friends.map((friend, index) => (
                <li className="friend" key={index}>
                    <div className="div-friend-list">
                        <img
                            src={
                                "/api/profile/" + friend["username"] + "/image"
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
                            onClick={() => toogleMenu(friend)}
                        >
                            Menu
                        </button>
                    </div>
                    {showMenu === friend && (
                        <FriendMenu friend={friend} closeMenu={closeMenu} />
                    )}
                </li>
            ))}
        </ul>
    );
}
