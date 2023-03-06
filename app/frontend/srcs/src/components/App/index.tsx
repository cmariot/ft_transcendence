import { useContext, useEffect } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import { RouterProvider } from "react-router-dom";
import { loginRouter } from "../../routers/loginRouter";
import { appRouter } from "../../routers/appRouter";
import axios from "axios";

export const App = () => {
    const user = useContext(UserContext);

    useEffect(() => {
        (async () => {
            try {
                const [profileResponse, friendsResponse] = await Promise.all([
                    axios.get("/api/profile"),
                    axios.get("/api/profile/friends"),
                ]);

                const username = profileResponse.data.username;
                const avatar =
                    "/api/profile/" + profileResponse.data.username + "/image";
                const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
                const firstLog = profileResponse.data.firstLog;
                const friends = friendsResponse.data;

                if (profileResponse.status === 200) {
                    user.editUsername(username);
                    user.editAvatar(avatar);
                    user.editDoubleAuth(twoFactorsAuth);
                    user.setFirstLog(firstLog);
                    user.setFriends(friends);

                    //    //if (!socket.connected) {
                    //    //    socket.on("connect", () => {
                    //    //        socket.emit("userStatus", {
                    //    //            status: "Online",
                    //    //            socket: socket.id,
                    //    //            username: username,
                    //    //            // =
                    //    //            // username,
                    //    //        });
                    //    //    });
                    //    //} else {
                    //    //    socket.emit("userStatus", {
                    //    //        status: "Online",
                    //    //        socket: socket.id,
                    //    //        username,
                    //    //    });
                    //    //}

                    //    //socket.on("userLogout", () => {
                    //    //    console.log("Event log out");
                    //    //    user.setIsLogged(false);
                    //    //});
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return <RouterProvider router={loginRouter} />;
};
