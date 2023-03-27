import { UserContext } from "../../contexts/UserProvider";
import { useContext } from "react";
import "../../styles/Notifications.css";
import axios from "axios";
import { MenuContext } from "../../contexts/MenuProviders";
import { useNavigate } from "react-router-dom";

export const Notifications = () => {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const navigate = useNavigate();

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

    return (
        <menu id="notifications">
            {user.notifications.length > 0 ? (
                <>
                    {user.notifications.map((item, index) => (
                        <div className="notif" key={index}>
                            <p className="notif-type">{item.type}</p>
                            <p className="notif-message">{item.message}</p>
                            <div>
                                <button
                                    onClick={() =>
                                        acceptInvitation(item.message)
                                    }
                                >
                                    accept
                                </button>
                                <button>deny</button>
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
