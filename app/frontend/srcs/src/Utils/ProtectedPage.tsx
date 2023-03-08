import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "./GetCookie";
import axios from "axios";
import { UserContext } from "../Contexts/UserProvider";

export default function ProtectedPage() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLogged === false) {
            const authCookie = getCookie("authentification");
            if (!authCookie) {
                return navigate("/login");
            }
        }
    }, [user.isLogged, navigate]);

    useEffect(() => {
        if (user.isLogged === false) {
            (async () => {
                try {
                    const [profileResponse, friendsResponse] =
                        await Promise.all([
                            axios.get("/api/profile"),
                            axios.get("/api/profile/friends"),
                        ]);

                    if (
                        friendsResponse.status !== 200 ||
                        profileResponse.status !== 200
                    ) {
                        console.log("Cannot fetch your profile.");
                        return navigate("/login");
                    }

                    const username = profileResponse.data.username;
                    const avatar =
                        "/api/profile/" +
                        profileResponse.data.username +
                        "/image";
                    const twoFactorsAuth = profileResponse.data.twoFactorsAuth;
                    const firstLog = profileResponse.data.firstLog;
                    const friends = friendsResponse.data;

                    user.editUsername(username);
                    user.editAvatar(avatar);
                    user.editDoubleAuth(twoFactorsAuth);
                    user.setFriends(friends);
                    user.setIsLogged(true);
                    user.setIsFirstLog(firstLog);
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
    });

    return user.isLogged ? <Outlet /> : null;
}
