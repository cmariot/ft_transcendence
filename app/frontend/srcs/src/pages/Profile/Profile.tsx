import { useNavigate } from "react-router-dom";
import { UserContext } from "../App/App";
import "../../styles/Profile.css";
import { MouseEvent, useContext } from "react";

const Profile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  function goToSettings(event: MouseEvent) {
    event.preventDefault();
    navigate("/settings");
  }

  return (
    <main id="profile">
      <h2>Your profile</h2>
      <img id="profile-user-picture" src={user.avatar} alt="user-imag" />
      <h3>{user.username}</h3>
      <button
        onClick={(event) => {
          goToSettings(event);
        }}
      >
        edit
      </button>
    </main>
  );
};

export default Profile;
