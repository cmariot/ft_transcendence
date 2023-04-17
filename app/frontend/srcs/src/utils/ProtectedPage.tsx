import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "./GetCookie";
import { SocketContext } from "../contexts/sockets/SocketProvider";
import { ChatContext } from "../contexts/chat/ChatContext";
import { GameContext } from "../contexts/game/GameContext";
import { UserContext } from "../contexts/user/UserContext";
import { MenuContext } from "../contexts/menu/MenuContext";
import { Menu } from "../components/menu/menu";
import { Notifications } from "../components/notifications/notifications";
import { arrayToMap } from "../events/chat/functions/arrayToMap";

export default function ProtectedPage() {
    const navigate = useNavigate();

    const user = useContext(UserContext);
    const game = useContext(GameContext);
    const menu = useContext(MenuContext);
    const chat = useContext(ChatContext);
    const socket = useContext(SocketContext);

    useEffect(() => {
        const authCookie = getCookie("authentification");
        if (!authCookie) {
            user.setIsLogged(false);
            return navigate("/login");
        }
        if (user.isForcedLogout) {
            user.setIsForcedLogout(false);
            user.editUsername("");
            user.setIsLogged(false);
            return navigate("/login");
        } else if (user.isLogged === false) {
            (async () => {
                try {
                    const [
                        profileResponse,
                        friendsResponse,
                        blockedResponse,
                        gameResponse,
                        channelsResponse,
                    ] = await Promise.all([
                        axios.get("/api/profile"),
                        axios.get("/api/profile/friends"),
                        axios.get("/api/profile/blocked"),
                        axios.get("/api/game/current"),
                        axios.get("/api/chat/channels"),
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

                    if (channelsResponse.status === 200) {
                        chat.updateUserChannels(
                            arrayToMap(channelsResponse.data.userChannels)
                        );
                        chat.updateUserPrivateChannels(
                            arrayToMap(
                                channelsResponse.data.userPrivateChannels
                            )
                        );
                        chat.updateAvailableChannels(
                            arrayToMap(channelsResponse.data.availableChannels)
                        );
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
                    game.setMenu("JoinGame");
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

    useEffect(() => {
        async function goHome() {
            navigate("/");
        }
        socket.on("game.start", goHome);
        return () => {
            socket.off("game.start", goHome);
        };
    }, [socket, navigate]);

    return user.isLogged ? (
        <>
            {/*menu.display &&*/ <Menu />}
            {menu.displayNotifs === true ? <Notifications /> : <Outlet />}
        </>
    ) : null;
}
