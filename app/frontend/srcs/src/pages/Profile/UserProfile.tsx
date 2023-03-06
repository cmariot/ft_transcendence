import { useLoaderData, useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Contexts/UserProvider";

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
            return navigate("/profile");
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

    const addFriend = async (username: string) => {
        await axios
            .post("/api/profile/friends/add", {
                username: username,
            })
            .then(function (response) {
                user.setFriends(response.data);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    async function removeFriend(friendUsername: string) {
        await axios
            .post("/api/profile/friends/remove", {
                username: friendUsername,
            })
            .then(function (response) {
                user.setFriends(response.data);
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    }

    function friendOrUnfriend(username: string) {
        let i = 0;
        let already_friend = false;
        while (i < user.friends.length) {
            let friend: any = user.friends[i];
            let friend_username: string = friend.username;
            if (friend_username === username) {
                already_friend = true;
                break;
            }
            i++;
        }
        if (already_friend === true) {
            return (
                <button onClick={() => removeFriend(username)}>
                    remove friend
                </button>
            );
        } else {
            return (
                <button onClick={() => addFriend(username)}>add friend</button>
            );
        }
    }

    async function unblock(username: string) {
        await axios
            .post("/api/profile/unblock", { username: username })
            .then((response) => {
                user.setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function blockUser(username: string) {
        await axios
            .post("/api/profile/block", { username: username })
            .then(async (response) => {
                user.setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    function blockOrUnblock() {
        let i = 0;
        let already_blocked = false;
        while (i < user.blocked.length) {
            let blocked: any = user.blocked[i];
            let blocked_username: string = blocked.username;
            if (blocked_username === username) {
                already_blocked = true;
                break;
            }
            i++;
        }
        if (already_blocked) {
            return <button onClick={() => unblock(username)}>unblock</button>;
        } else {
            return <button onClick={() => blockUser(username)}>block</button>;
        }
    }

    function displayProfileOrError() {
        if (found) {
            return (
                <>
                    <h2>{username}'s profile</h2>
                    {userImage && (
                        <img
                            id="profile-user-picture"
                            src={userImage}
                            alt="user-imag"
                        />
                    )}
                    <h3>{username}</h3>
                    <div>
                        {friendOrUnfriend(username)}
                        {blockOrUnblock()}
                        <button onClick={() => goToPrevious()}>return</button>
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
