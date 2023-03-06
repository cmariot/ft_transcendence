import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ChatParent } from "../Home/Chat/ChatParent";
import { socket } from "../../Contexts/WebsocketContext";
import ConfirmProfile from "../Settings/ConfirmProfile";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserProvider";

export const App = () => {
    //    const user = useContext(UserContext);
    //
    //    useEffect(() => {
    //        (async () => {
    //            try {
    //                const [profileResponse, friendsResponse] = await Promise.all([
    //                    axios.get("/api/profile"),
    //                    axios.get("/api/profile/friends"),
    //                ]);
    //
    //                const username = profileResponse.data.username;
    //                const avatar =
    //                    "/api/profile/" + profileResponse.data.username + "/image";
    //                const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
    //                const firstLog = profileResponse.data.firstLog;
    //
    //                if (profileResponse.status === 200) {
    //                    user.editUsername(username);
    //                    user.editAvatar(avatar);
    //                    user.editDoubleAuth(twoFactorsAuth);
    //                    user.setFirstLog(firstLog);
    //
    //                    if (!socket.connected) {
    //                        socket.on("connect", () => {
    //                            socket.emit("userStatus", {
    //                                status: "Online",
    //                                socket: socket.id,
    //                                username: username,
    //                                // =
    //                                // username,
    //                            });
    //                        });
    //                    } else {
    //                        socket.emit("userStatus", {
    //                            status: "Online",
    //                            socket: socket.id,
    //                            username,
    //                        });
    //                    }
    //
    //                    //socket.on("userLogout", () => {
    //                    //    console.log("User logged out");
    //
    //                    //    navigate("/");
    //                    //    setLogged(!logged);
    //                    //    if (logged === false) {
    //                    //        setLogged(true);
    //                    //    }
    //                    //});
    //                }
    //
    //                user.setFriends(friendsResponse.data);
    //            } catch (error) {
    //                console.error(error);
    //            }
    //        })();
    //    });
    //useEffect(() => {
    //    socket.on("userUpdate", () => {
    //        setFriendUpdate(!friendUpdate);
    //    });
    //    socket.on("userStatus", () => {
    //        setFriendUpdate(!friendUpdate);
    //    });
    //});
    //if (firstLog === true) {
    //    return <ConfirmProfile />;
    //} else {
    //    return <ChatParent />;
    //}
};
