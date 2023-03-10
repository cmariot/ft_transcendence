import axios from "axios";
import { useState, useContext } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../contexts/UserProvider";

export default function AddFriend() {
    let user = useContext(UserContext);

    const [newFriendUsername, setNewFriendUsername] = useState("");

    const addFriend = async (event: any) => {
        event.preventDefault();
        try {
            const friendsResponse = await axios.post(
                "/api/profile/friends/add",
                {
                    username: newFriendUsername,
                }
            );
            if (friendsResponse.status === 201) {
                user.setFriends(friendsResponse.data);
            }
        } catch (error: any) {
            alert(error.response.data.message);
        }
        setNewFriendUsername("");
    };

    return (
        <aside id="add-friend">
            <h2>Add a new friend</h2>
            <form onSubmit={addFriend} autoComplete="off">
                <input
                    type="text"
                    value={newFriendUsername}
                    onChange={(event) =>
                        setNewFriendUsername(event.target.value)
                    }
                />
                <button type="submit">Add Friend</button>
            </form>
        </aside>
    );
}
