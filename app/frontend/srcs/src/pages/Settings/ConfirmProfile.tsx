import axios from "axios";
import "../../styles/ConfirmProfile.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import EditProfilePicture from "./EditProfilePicture";
import EditUsername from "./EditUsername";
import EnableDoubleAuth from "./EnableDoubleAuth";
import { UserContext } from "../../contexts/user/UserContext";

export default function ConfirmProfile() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    function confirmProfile() {
        axios
            .get("/api/profile/confirm")
            .then(() => {
                user.setIsFirstLog(false);
                user.setIsLogged(true);
                navigate("/");
            })
            .catch(() => {});
    }

    return (
        <div className="flex">
            <main id="main-confirm-profile">
                <section id="section-confirm-profile">
                    <h2>It's a pleasure to have a new player !</h2>
                    <h3>
                        As this is your first time visiting this site, check or
                        edit your profile
                        <br />
                        Click on the button bellow to confirm your profile.
                    </h3>
                    <EditProfilePicture />
                    <EditUsername />
                    <EnableDoubleAuth />
                    <button onClick={() => confirmProfile()}>Let's play</button>
                </section>
            </main>
        </div>
    );
}
