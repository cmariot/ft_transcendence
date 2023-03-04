import axios from "axios";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App/App";

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
        user.editUsername(newValue);
        setUsername(newValue);
        navigate("/settings");
      })
      .catch(function (error) {
        setUsername(user.username);
        alert(error.response.data.message);
      });
  };

  useEffect(() => {
    setUsername(user.username);
  }, [user.username]);

  return (
    <div id="username-main">
      <form id="username-form" autoComplete="off">
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
