import { useContext, useEffect } from "react";
import "../../styles/Notifications.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";

export const Notifications = () => {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const navigate = useNavigate();

    useEffect(() => {}, [user.notifications]);

    async function acceptInvitation(username: string) {
        await axios
            .post("/api/game/invitation/accept", { username: username })
            .then(() => {
                navigate("/");
                menu.toogleNotifs();
            })
            .catch((error) => {
                menu.displayError(error.response.data.message);
            });
    }

    async function denyInvitation(username: string) {
        await axios
            .post("/api/game/invitation/deny", { username: username })
            .then(() => {
                navigate("/");
                menu.toogleNotifs();
            })
            .catch((error) => {
                menu.displayError(error.response.data.message);
            });
    }

    return (
        <menu id="notifications">
            {user.notifications.length > 0 ? (
                <>
                    {user.notifications.map((item, index) => (
                        <div className="notif notif-div" key={index}>
                            <p className="notif-type">
                                {item.type === "game invitation"
                                    ? item.message + " wants to play with you."
                                    : "notification type :" + item.type}
                            </p>
                            <div>
                                <button
                                    onClick={() =>
                                        acceptInvitation(item.message)
                                    }
                                >
                                    accept
                                </button>
                                <button
                                    onClick={() => denyInvitation(item.message)}
                                >
                                    deny
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="no-notif">
                    <p>No notifications yet</p>
                </div>
            )}
        </menu>
    );
};
