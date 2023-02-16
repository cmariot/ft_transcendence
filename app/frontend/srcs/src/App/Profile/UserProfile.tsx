import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "../CSS/Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";

export function loader({ params }: any) {
    return params;
}

const UserProfile = () => {
    const params: any = useLoaderData();
    const navigate = useNavigate();
    const [found, setFound] = useState(true);
    let user: string = params.user;
    let userImage: string = "/api/profile/" + user + "/image";

    useEffect(() => {
        axios
            .get("/api/profile/" + user + "/image")
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

    function displayProfileOrError() {
        if (found) {
            return (
                <>
                    <h2>{user}'s profile</h2>
                    <img
                        id="profile-user-picture"
                        src={userImage}
                        alt="user-imag"
                    />
                    <h3>{user}</h3>
                    <button onClick={() => goToPrevious()}>return</button>
                </>
            );
        } else {
            return <h2>not found</h2>;
        }
    }
    return <main id="profile">{displayProfileOrError()}</main>;
};

export default UserProfile;
