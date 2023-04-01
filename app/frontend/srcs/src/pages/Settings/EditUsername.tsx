import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";

export default function EditUsername() {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
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
            menu.displayError("Change your username");
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
                menu.displayError(error.response.data.message);
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
