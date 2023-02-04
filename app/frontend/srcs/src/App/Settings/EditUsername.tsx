import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function EditUsername(props) {
    const [username, setUsername] = useState(props.user["username"]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
        }
    };

    const submitUsernameForm = async (event) => {
        event.preventDefault();
        if (username == props.user["username"]) {
            alert("Change your username");
            return;
        }
        await axios
            .post("/api/profile/update/username", {
                username: username,
            })
            .then(function () {
                props.user["setUsername"](username);
            })
            .catch(function (error) {
                setUsername(props.user["username"]);
                alert(error.response.data.message);
            });
    };

    useEffect(() => {
        setUsername(props.user["username"]);
    }, [props.user["username"]]);

    return (
        <div id="username-main">
            <form id="username-form">
                <input
                    id="username"
                    type="text"
                    placeholder="New Username"
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
        </div>
    );
}
