import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserProvider";
import { getCookie } from "./GetCookie";

export default function ProtectedPage() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isForcedLogout) {
            user.setIsForcedLogout(false);
            user.editUsername("");
            user.setIsLogged(false);
            navigate("/login");
        } else if (user.isLogged) {
            const authCookie = getCookie("authentification");
            if (!authCookie) {
                return navigate("/login");
            }
        } else if (user.isLogged === false) {
            const authCookie = getCookie("authentification");
            if (!authCookie) {
                return navigate("/login");
            }
            (async () => {
                try {
                    const [profileResponse, friendsResponse, blockedResponse] =
                        await Promise.all([
                            axios.get("/api/profile"),
                            axios.get("/api/profile/friends"),
                            axios.get("/api/profile/blocked"),
                        ]);

                    if (
                        friendsResponse.status !== 200 ||
                        profileResponse.status !== 200 ||
                        blockedResponse.status !== 200
                    ) {
                        console.log("Cannot fetch your profile.");
                        return navigate("/login");
                    }

                    const username = profileResponse.data.username;
                    const avatar = "/api/profile/" + username + "/image";
                    const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
                    const firstLog = profileResponse.data.firstLog;
                    const winRatio = profileResponse.data.ratio;
                    const gamehistory = profileResponse.data.gameHistory;
                    const rank = profileResponse.data.rank;
                    const friends = friendsResponse.data;
                    const blocked = blockedResponse.data;

                    try {
                        const avatarResponse = await axios.get(avatar, {
                            responseType: "blob",
                        });
                        if (avatarResponse.status === 200) {
                            var imageUrl = URL.createObjectURL(
                                avatarResponse.data
                            );
                            user.editAvatar(imageUrl);
                        } else {
                            user.editAvatar(avatar);
                        }
                    } catch (error) {
                        user.editAvatar(avatar);
                        console.log(error);
                    }

                    for (let i = 0; i < friends.length; i++) {
                        try {
                            const url =
                                "/api/profile/" +
                                friends[i].username +
                                "/image";
                            const avatarResponse = await axios.get(url, {
                                responseType: "blob",
                            });
                            if (avatarResponse.status === 200) {
                                imageUrl = URL.createObjectURL(
                                    avatarResponse.data
                                );
                                friends[i].avatar = imageUrl;
                            } else {
                                friends[i].avatar = url;
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    for (let i = 0; i < blocked.length; i++) {
                        try {
                            const url =
                                "/api/profile/" +
                                blocked[i].username +
                                "/image";
                            const avatarResponse = await axios.get(url, {
                                responseType: "blob",
                            });
                            if (avatarResponse.status === 200) {
                                imageUrl = URL.createObjectURL(
                                    avatarResponse.data
                                );
                                blocked[i].avatar = imageUrl;
                            } else {
                                blocked[i].avatar = url;
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    user.editUsername(username);
                    user.editDoubleAuth(twoFactorsAuth);
                    user.setFriends(friends);
                    user.setWinRatio(winRatio);
                    user.setGamehistory(gamehistory);
                    user.setRank(rank);
                    user.setBlocked(blocked);
                    user.setIsLogged(true);
                    user.setIsFirstLog(firstLog);
                    user.setClickOnLogin(true);
                    user.setClickOnLogout(false);
                    if (firstLog) {
                        return navigate("/welcome");
                    }
                } catch (error) {
                    user.setIsLogged(false);
                    user.setIsFirstLog(false);
                    navigate("/login");
                }
            })();
        }
    }, [navigate, user]);

    return user.isLogged ? <Outlet /> : null;
}
