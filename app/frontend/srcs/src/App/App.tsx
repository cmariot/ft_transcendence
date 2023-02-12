import axios from "axios";
import { socket } from "../Contexts/WebsocketContext";
import React from "react";
import UserContext from "../Contexts/UserContext";
import "./CSS/Theme.css";
import { ChatParent } from "./Home/Chat/ChatParent";
export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            user: {
                username: "",
                avatar: "",
                doubleAuth: true,
                friends: [],
            },
        };
    }

    async fetchUser() {
        return await axios
            .get("/api/profile")
            .then((response) => {
                this.setState({
                    user: {
                        ...this.state.user,
                        username: response.data.username,
                        doubleAuth: response.data.twoFactorsAuth,
                        avatar:
                            "/api/profile/" + response.data.username + "/image",
                    },
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    async fetchFriends() {
        return await axios
            .get("/api/profile/friends")
            .then((response) => {
                this.setState({
                    user: {
                        ...this.state.user,
                        friends: response.data,
                    },
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    componentDidMount() {
        this.fetchUser();
        this.fetchFriends();
        socket.emit("userStatus", {
            status: "Online",
            socket: socket.id,
            username: this.state.user.username,
        });
    }

    render() {
        let { username, doubleAuth, avatar, friends } = this.state.user;

        let user = {
            username: username,
            doubleAuth: doubleAuth,
            avatar: avatar,
            friends: friends,
            updateUsername: function (newUsername: string) {
                this.username = newUsername;
            },
            updateAvatar: function (newAvatar: string) {
                this.avatar = newAvatar;
            },
            updateDoubleAuth: function () {
                this.doubleAuth = !this.doubleAuth;
            },
            addFriend: function (username: string) {
                this.friends.push(username);
            },
            removeFriend: function (username: string) {
                const index = this.friends.indexOf(username);
                if (index !== -1) {
                    this.friends.splice(index, 1);
                }
            },
        };

        return (
            <UserContext.Provider value={user}>
                <ChatParent />
            </UserContext.Provider>
        );
    }
}
