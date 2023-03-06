import { useContext, useEffect } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../Utils/GetCookie";
import axios from "axios";

export const AuthProtectedRoute = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    console.log("AuthProtectedRoute");

    useEffect(() => {
        if (user.isLogged === false) {
            const authCookie = getCookie("authentification");
            if (!authCookie) {
                return navigate("/login");
            }
            (async () => {
                try {
                    const [profileResponse, friendsResponse] =
                        await Promise.all([
                            axios.get("/api/profile"),
                            axios.get("/api/profile/friends"),
                        ]);
                    const username = profileResponse.data.username;
                    const avatar =
                        "/api/profile/" +
                        profileResponse.data.username +
                        "/image";
                    const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
                    const firstLog = profileResponse.data.firstLog;
                    const friends = friendsResponse.data;

                    if (profileResponse.status === 200) {
                        user.editUsername(username);
                        user.editAvatar(avatar);
                        user.editDoubleAuth(twoFactorsAuth);
                        user.setFriends(friends);
                        user.setFirstLog(firstLog);
                        user.setIsLogged(true);
                        if (firstLog) {
                            return navigate("/welcome");
                        }
                    }
                } catch (error) {
                    user.setIsLogged(false);
                    user.setFirstLog(false);
                    navigate("/login");
                }
            })();
        }
    });

    return user.isLogged ? <Outlet /> : null;
};

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
