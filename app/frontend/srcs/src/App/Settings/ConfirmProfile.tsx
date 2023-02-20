import axios from "axios";
import "../CSS/Settings.css";
import "../CSS/Theme.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import AuthNavbar from "../../Auth/AuthNavbar";
import EditProfilePicture from "./EditProfilePicture";
import EditUsername from "./EditUsername";
import EnableDoubleAuth from "./EnableDoubleAuth";
import AuthFooter from "../../Auth/AuthFooter";

export default function ConfirmProfile() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    function confirmProfile() {
        axios
            .get("/api/profile/confirm")
            .then(() => {
                user.setFirstLog(false);
                navigate("/");
            })
            .catch(() => {});
    }

    return (
        <>
            <AuthNavbar />
            <main>
                <section>
                    <h2>It's a pleasure to have a new player !</h2>
                    <h3>
                        As this is your first time visiting this site, check or
                        edit your profile
                        <br />
                        Click on the button bellow to confirm your profile.
                    </h3>
                    <button onClick={() => confirmProfile()}>Let's play</button>
                </section>
                <section id="main-settings">
                    <h2>Edit your profile</h2>
                    <EditProfilePicture />
                    <EditUsername />
                    <EnableDoubleAuth />
                </section>
            </main>
            <AuthFooter />
        </>
    );
}
