import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "../../Contexts/UserProvider";

export default function EditUsername() {
    const user = useContext(UserContext);
    const [newUsername, setNewUsername] = useState(user.username);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setNewUsername(value);
        }
    };

    const submitUsernameForm = async (event: any) => {
        event.preventDefault();
        if (newUsername === user.username) {
            alert("Change your username");
            return;
        }
        await axios
            .post("/api/profile/update/username", {
                username: newUsername,
            })
            .then(function () {
                user.editUsername(newUsername);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    return (
        <div id="username-main">
            <form id="username-form" autoComplete="off">
                <input
                    id="username"
                    type="text"
                    placeholder="New Username"
                    value={newUsername}
                    onChange={handleInputChange}
                    autoComplete="off"
                    autoFocus
                    required
                />
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Edit Username"
                    onClick={submitUsernameForm}
                />
            </form>
        </div>
    );
}
