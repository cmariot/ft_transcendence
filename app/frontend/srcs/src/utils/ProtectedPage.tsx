import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserProvider";
import { getCookie } from "./GetCookie";
import { GameContext } from "../contexts/GameProvider";
import { MenuContext } from "../contexts/MenuProviders";

export default function ProtectedPage() {
    const user = useContext(UserContext);
    const game = useContext(GameContext);
    const navigate = useNavigate();
    const menu = useContext(MenuContext);

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
                    const [
                        profileResponse,
                        friendsResponse,
                        blockedResponse,
                        gameResponse,
                    ] = await Promise.all([
                        axios.get("/api/profile"),
                        axios.get("/api/profile/friends"),
                        axios.get("/api/profile/blocked"),
                        axios.get("/api/game/current"),
                    ]);

                    if (
                        friendsResponse.status !== 200 ||
                        profileResponse.status !== 200 ||
                        blockedResponse.status !== 200 ||
                        gameResponse.status !== 200
                    ) {
                        menu.displayError("Cannot fetch your profile.");
                        return navigate("/login");
                    }

                    const username = profileResponse.data.username;
                    const avatar = "/api/profile/" + username + "/image";
                    const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
                    const firstLog = profileResponse.data.firstLog;
                    const winRatio = profileResponse.data.ratio;
                    const gamehistory = profileResponse.data.gameHistory;
                    const rank = profileResponse.data.rank;
                    const notifications = profileResponse.data.notifications;
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
                    } catch (error: any) {
                        user.editAvatar(avatar);
                        menu.displayError(error);
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
                        } catch (error: any) {
                            menu.displayError(error.response.data.message);
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
                        } catch (error: any) {
                            menu.displayError(error.response.data.message);
                        }
                    }

                    user.editUsername(username);
                    user.editDoubleAuth(twoFactorsAuth);
                    user.setFriends(friends);
                    user.setWinRatio(winRatio);
                    user.setGamehistory(gamehistory);
                    user.setRank(rank);
                    user.setNotifications(notifications);
                    user.setBlocked(blocked);
                    user.setIsLogged(true);
                    user.setIsFirstLog(firstLog);
                    user.setClickOnLogin(true);
                    user.setClickOnLogout(false);
                    game.setCurrentGames(gameResponse.data);

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
    }, [navigate, user, game, menu]);

    return user.isLogged ? <Outlet /> : null;
}
