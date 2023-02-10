import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import UserContext from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function EditUsername() {
    const user = useContext(UserContext);
    const [username, setUsername] = useState(user.username);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
        }
    };

    const submitUsernameForm = async (event: any) => {
        event.preventDefault();
        const newValue: string = username;
        if (newValue === user.username) {
            alert("Change your username");
            return;
        }
        await axios
            .post("/api/profile/update/username", {
                username: newValue,
            })
            .then(function () {
                user.updateUsername(newValue);
                setUsername(newValue);
                navigate("/settings");
            })
            .catch(function (error) {
                console.log(error);
                alert(error);
            });
    };

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
