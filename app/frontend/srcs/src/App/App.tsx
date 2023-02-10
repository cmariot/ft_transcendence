import AppFooter from "./AppFooter";
import axios from "axios";
import { socket } from "../Contexts/WebsocketContext";
import { Outlet } from "react-router-dom";
import React from "react";
import AppNavBar from "./AppNavBar";
import UserContext from "../Contexts/UserContext";

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

    fetchUser() {
        axios
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

    fetchFriends() {
        axios
            .get("/api/profile/friend")
            .then((response) => {
                //Create the array from the response

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
        this.setState({ loading: false });
    }

    render() {
        const { username, doubleAuth, avatar, friends } = this.state.user;

        const user = {
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
            <>
                {this.state.loading ? (
                    <p>Loading ...</p>
                ) : (
                    <UserContext.Provider value={user}>
                        <AppNavBar />
                        <div id="app-content">
                            <Outlet />
                        </div>
                        <AppFooter />
                    </UserContext.Provider>
                )}
            </>
        );
    }
}
