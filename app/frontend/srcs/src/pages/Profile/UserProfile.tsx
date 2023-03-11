import { useLoaderData, useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserProvider";

export function loader({ params }: any) {
    return params;
}

const UserProfile = () => {
    const params: any = useLoaderData();
    const navigate = useNavigate();
    const [found, setFound] = useState(true);
    const [image, setImage] = useState("");

    let user = useContext(UserContext);

    const username: string = params.user;
    const imageURL: string = "/api/profile/" + username + "/image";

    useEffect(() => {
        if (user.username === username) {
            return navigate("/profile");
        }
        (async () => {
            try {
                const avatarResponse = await axios.get(imageURL, {
                    responseType: "blob",
                });
                if (avatarResponse.status === 200) {
                    var imageUrl = URL.createObjectURL(avatarResponse.data);
                    setImage(imageUrl);
                    setFound(true);
                } else {
                    setFound(false);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [imageURL, navigate, user.username, username]);

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
        return already_friend ? (
            <button onClick={() => removeFriend(username)}>
                remove friend
            </button>
        ) : (
            <button onClick={() => addFriend(username)}>add friend</button>
        );
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
                    {image && (
                        <img
                            id="profile-user-picture"
                            src={image}
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
