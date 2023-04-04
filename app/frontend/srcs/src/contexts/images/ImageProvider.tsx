import { useEffect, useState } from "react";
import { ImageContext } from "./ImagesContext";
import { useRouteError } from "react-router-dom";
import axios from "axios";

type ImageProviderProps = { children: JSX.Element | JSX.Element[] };
const ImageProvider = ({ children }: ImageProviderProps) => {
    const [logo, setLogo] = useState("");
    const [home, setHome] = useState("");
    const [friends, setFriends] = useState("");
    const [profile, setProfile] = useState("");
    const [settings, setSettings] = useState("");
    const [logout, setLogout] = useState("");
    const [notifs, setNotifs] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const [
                    logoResponse,
                    homeResponse,
                    friendsResponse,
                    profileResponse,
                    settingsResponse,
                    logoutResponse,
                    notifsResponse,
                ] = await Promise.all([
                    axios.get("/logo.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/home.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/friends.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/profile.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/settings.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/logout.svg", {
                        responseType: "blob",
                    }),
                    axios.get("/icones/notifs.svg", {
                        responseType: "blob",
                    }),
                ]);

                if (logoResponse.status === 200) {
                    var imageUrl = URL.createObjectURL(logoResponse.data);
                    setLogo(imageUrl);
                }
                if (homeResponse.status === 200) {
                    imageUrl = URL.createObjectURL(homeResponse.data);
                    setHome(imageUrl);
                }
                if (friendsResponse.status === 200) {
                    imageUrl = URL.createObjectURL(friendsResponse.data);
                    setFriends(imageUrl);
                }
                if (profileResponse.status === 200) {
                    imageUrl = URL.createObjectURL(profileResponse.data);
                    setProfile(imageUrl);
                }
                if (settingsResponse.status === 200) {
                    imageUrl = URL.createObjectURL(settingsResponse.data);
                    setSettings(imageUrl);
                }
                if (logoutResponse.status === 200) {
                    imageUrl = URL.createObjectURL(logoutResponse.data);
                    setLogout(imageUrl);
                }
                if (notifsResponse.status === 200) {
                    imageUrl = URL.createObjectURL(notifsResponse.data);
                    setNotifs(imageUrl);
                }
            } catch (error) {
                alert(error);
            }
        })();
    }, []);

    const value = {
        logo,
        home,
        friends,
        profile,
        settings,
        logout,
        notifs,
    };

    return (
        <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
    );
};

export default ImageProvider;
