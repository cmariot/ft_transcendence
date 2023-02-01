import axios from "axios";
import { ChangeEvent, useState } from "react";

export default function EditUsername(props) {
    const [username, setUsername] = useState(props.userProps.username);

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
                props.userProps.setUsername(username);
            })
            .catch(function (error) {
                console.log(error);
                alert(error.response.data.message);
            });
    };

    return (
        <main id="username-main">
            <form id="username-form">
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
                    value="Edit Username"
                    onClick={(event) => submitUsernameForm(event)}
                />
            </form>
        </main>
    );
}
