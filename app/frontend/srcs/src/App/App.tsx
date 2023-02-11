import AppFooter from "./AppFooter";
import axios from "axios";
import { socket } from "../Contexts/WebsocketContext";
import { Outlet } from "react-router-dom";
import React from "react";
import AppNavBar from "./AppNavBar";
import UserContext from "../Contexts/UserContext";
import ChatContext from "../Contexts/ChatContext";

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
            chat: {
                currentChannel: "General",
                currentChannelMessages: [],
                availableChannels: new Map<string, { channelType: string }>(),
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

    // https://stackoverflow.com/questions/61657089/how-to-render-streamable-image-response-in-react-as-a-image
    async fetchFriends() {
        return await axios
            .get("/api/profile/friends")
            .then((response) => {
                console.log(response.data);
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

    async fetchChatChannels() {
        axios
            .get("/api/chat/channels")
            .then((response) => {
                let initialChannels = new Map<
                    string,
                    { channelType: string }
                >();
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i] && response.data[i].channelName) {
                        initialChannels.set(
                            response.data[i].channelName,
                            response.data[i]
                        );
                    }
                }
                this.setState({
                    chat: {
                        ...this.state.chat,
                        availableChannels: initialChannels,
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
        this.fetchChatChannels();
        socket.emit("userStatus", {
            status: "Online",
            socket: socket.id,
            username: this.state.user.username,
        });
        this.setState({ loading: false });
        socket.on("newChatMessage", (socket) => {
            console.log(
                "New message on ",
                socket.channel,
                " from ",
                socket.username,
                " : ",
                socket.message
            );

            this.setState({
                chat: {
                    ...this.state.chat,
                    currentChannelMessages: [
                        ...this.state.chat.currentChannelMessages,
                        { username: socket.username, message: socket.message },
                    ],
                },
            });

            console.log(socket);
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

        let { currentChannel, currentChannelMessages, availableChannels } =
            this.state.chat;

        let chat = {
            currentChannel: currentChannel,
            currentChannelMessages: currentChannelMessages,
            availableChannels: availableChannels,
        };

        return (
            <UserContext.Provider value={user}>
                <ChatContext.Provider value={chat}>
                    <AppNavBar />
                    <div id="app-content">
                        <Outlet />
                    </div>
                    <AppFooter />
                </ChatContext.Provider>
            </UserContext.Provider>
        );
    }
}
