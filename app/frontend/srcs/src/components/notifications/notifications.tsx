import { UserContext } from "../../contexts/UserProvider";
import { useContext } from "react";
import "../../styles/Notifications.css";

export const Notifications = () => {
    const user = useContext(UserContext);

    return (
        <menu id="notifications">
            {user.notifications.length > 0 ? (
                <>
                    {user.notifications.map((item, index) => (
                        <div className="notif" key={index}>
                            <p className="notif-message">{item.message}</p>
                            <p className="notif-type">{item.type}</p>
                            <div>
                                <button>accept</button>
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
