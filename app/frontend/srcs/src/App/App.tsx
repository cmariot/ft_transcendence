import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatParent } from "./Home/Chat/ChatParent";
import { socket } from "../Contexts/WebsocketContext";
import ConfirmProfile from "./Settings/ConfirmProfile";
import { useNavigate } from "react-router-dom";

export const UserContext = React.createContext({
    username: "",
    editUsername: (newUsername: string) => {},
    avatar: "",
    editAvatar: (newAvatar: string) => {},
    firstLog: false,
    setFirstLog: (newValue: boolean) => {},
    doubleAuth: true,
    editDoubleAuth: (newValue: boolean) => {},
    friends: [],
    setFriends: (newFriends: []) => {},
    blocked: [],
    setBlocked: (newFriends: []) => {},
});

export const App = () => {
    const [username, editUsername] = useState("");
    const [avatar, editAvatar] = useState("");
    const [doubleAuth, editDoubleAuth] = useState(true);
    const [friends, setFriends] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [firstLog, setFirstLog] = useState(false);
    const [friendUpdate, setFriendUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/api/profile")
            .then((response: any) => {
                editUsername(response.data.username);
                editAvatar("/api/profile/" + response.data.username + "/image");
                editDoubleAuth(response.data.twoFactorsAuth);
                setFirstLog(response.data.firstLog);
                if (!socket.connected) {
                    socket.on("connect", () => {
                        socket.emit("userStatus", {
                            status: "Online",
                            socket: socket.id,
                            username: response.data.username,
                        });
                    });
                } else {
                    socket.emit("userStatus", {
                        status: "Online",
                        socket: socket.id,
                        username: response.data.username,
                    });
                }
            })
            .catch((error) => {
                console.log(error.response);
            });
        axios
            .get("/api/profile/friends")
            .then((response) => {
                setFriends(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
        socket.on("userLogout", () => {
            console.log("LAAAAA");
            //navigate("/login");
        });
    }, []);

    useEffect(() => {
        socket.on("userUpdate", () => {
            setFriendUpdate(!friendUpdate);
        });
        socket.on("userStatus", () => {
            setFriendUpdate(!friendUpdate);
        });
        axios
            .get("/api/profile/friends")
            .then((response) => {
                setFriends(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
        axios
            .get("/api/profile/blocked")
            .then((response) => {
                setBlocked(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }, [friendUpdate]);

    const value = {
        username,
        editUsername,
        avatar,
        editAvatar,
        firstLog,
        setFirstLog,
        doubleAuth,
        editDoubleAuth,
        friends,
        setFriends,
        blocked,
        setBlocked,
    };

    if (firstLog === true) {
        return (
            <UserContext.Provider value={value as any}>
                <ConfirmProfile />
            </UserContext.Provider>
        );
    } else {
        return (
            <UserContext.Provider value={value as any}>
                <ChatParent />
            </UserContext.Provider>
        );
    }
};
