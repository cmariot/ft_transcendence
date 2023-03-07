import axios from "axios";
import { useContext } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../Contexts/UserProvider";

export default function BlockedList() {
    let user = useContext(UserContext);

    async function unblock(username: string) {
        try {
            const unblockResponse = await axios.post("/api/profile/unblock", {
                username: username,
            });
            if (unblockResponse.status === 201) {
                user.setBlocked(unblockResponse.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section>
            <ul id="friend-list">
                <h2>blocked list</h2>
                {user.blocked.map((blocked, index) => (
                    <li className="friend blocked" key={index}>
                        <img
                            src={
                                "/api/profile/" + blocked["username"] + "/image"
                            }
                            className="friend-profile-picture"
                            alt="Friend's avatar"
                        />
                        <div className="friend-middle-div">
                            <p className="friend-username">
                                <b>{blocked["username"]}</b>
                            </p>
                        </div>
                        <button onClick={() => unblock(blocked["username"])}>
                            unblock
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
