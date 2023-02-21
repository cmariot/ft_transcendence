import { useLoaderData, useNavigate } from "react-router-dom";
import "../CSS/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";

export function loader({ params }: any) {
    return params;
}

const UserProfile = () => {
    const params: any = useLoaderData();
    const navigate = useNavigate();
    const [found, setFound] = useState(true);

    let user = useContext(UserContext);

    let username: string = params.user;
    let userImage: string = "/api/profile/" + username + "/image";

    useEffect(() => {
        if (user.username === username) {
            navigate("/profile");
            return;
        }
        axios
            .get("/api/profile/" + username + "/image")
            .then((response) => {
                if (found === false) {
                    setFound(true);
                }
            })
            .catch((error) => {
                if (found === true) {
                    setFound(false);
                }
            });
    });

    function goToPrevious() {
        navigate(-1);
    }

    function friendOrUnriend() {
        return <button>add friend</button>;
    }

    function blockOrUnblock() {
        return <button>block</button>;
    }

    function displayProfileOrError() {
        if (found) {
            return (
                <>
                    <h2>{username}'s profile</h2>
                    <img
                        id="profile-user-picture"
                        src={userImage}
                        alt="user-imag"
                    />
                    <h3>{username}</h3>
                    <div>
                        {friendOrUnriend()}
                        {blockOrUnblock()}
                        <button onClick={() => goToPrevious()}>cancel</button>
                    </div>
                </>
            );
        } else {
            return <h2>not found</h2>;
        }
    }
    return <main id="profile">{displayProfileOrError()}</main>;
};

export default UserProfile;
