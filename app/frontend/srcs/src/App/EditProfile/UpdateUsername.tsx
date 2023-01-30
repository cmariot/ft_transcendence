import axios from "axios";
import { ChangeEvent, useState } from "react";

export default function UpdateUsername() {
    const [username, setUsername] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
        }
    };

    const submitUsernameForm = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/profile/update/username", {
                username: username,
            })
            .then(function (response) {
                setUsername("");
            })
            .catch(function (error) {
                alert("Oops! Some error occured.");
            });
    };

    return (
        <main id="username-main">
            <form id="username-form">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => handleInputChange(event)}
                    autoComplete="off"
                    autoFocus
                    required
                />
                <input
                    id="submit"
                    className="button"
                    type="submit"
                    value="Change Username"
                    onClick={(event) => submitUsernameForm(event)}
                />
            </form>
        </main>
    );
}
