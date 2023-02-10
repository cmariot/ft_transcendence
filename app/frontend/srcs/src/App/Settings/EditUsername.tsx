import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditUsername(props: any) {
    const [username, setUsername] = useState(props.user["username"]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
        }
    };

    const submitUsernameForm = async (event: any) => {
        event.preventDefault();
        const newValue: string = username;
        if (newValue === props.user["username"]) {
            alert("Change your username");
            return;
        }
        await axios
            .post("/api/profile/update/username", {
                username: newValue,
            })
            .then(function () {
                props.user["setUsername"](newValue);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    useEffect(() => {
        setUsername(props.user["username"]);
    }, [props.user]);

    return (
        <div id="username-main">
            <form id="username-form">
                <input
                    id="username"
                    type="text"
                    placeholder="New Username"
                    value={username}
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
