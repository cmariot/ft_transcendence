import "../../styles/Profile.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketProvider";

const Profile = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);

    function winPercentage() {
        if (user.winRatio.victory + user.winRatio.defeat > 0) {
            let scale = Math.pow(10, 1);
            let percent =
                Math.round(
                    (user.winRatio.victory /
                        (user.winRatio.victory + user.winRatio.defeat)) *
                        100 *
                        scale
                ) / scale;
            return "(" + percent.toString() + "%)";
        }
        return null;
    }

    function losePercentage() {
        if (user.winRatio.victory + user.winRatio.defeat > 0) {
            let scale = Math.pow(10, 1);
            let percent =
                Math.round(
                    (user.winRatio.defeat /
                        (user.winRatio.victory + user.winRatio.defeat)) *
                        100 *
                        scale
                ) / scale;
            return "(" + percent.toString() + "%)";
        }
        return null;
    }

    const socket = useContext(SocketContext);

    useEffect(() => {
        function updateFriendUsername(data: {
            previousUsername: string;
            newUsername: string;
        }) {
            if (data.newUsername !== user.username) {
                let history = user.gameHistory;
                for (let i = 0; i < history.length; i++) {
                    if (history[i].loser === data.previousUsername) {
                        history[i].loser = data.newUsername;
                    } else if (history[i].winner === data.previousUsername) {
                        history[i].winner = data.newUsername;
                    }
                }
                user.setGamehistory(history);
                setUpdate((prevState) => !prevState);
            }
        }
        socket.on("user.update.username", updateFriendUsername);
        return () => {
            socket.off("user.update.username", updateFriendUsername);
        };
    }, [user, socket]);

    return (
        <div>
            <main id="profile">
                <h2>Your profile</h2>
                {user.avatar && (
                    <img
                        id="profile-user-picture"
                        src={user.avatar}
                        alt="Your avatar"
                    />
                )}
                <h3>{user.username}</h3>
                <button
                    onClick={(event: any) => {
                        event.preventDefault();
                        navigate("/settings");
                    }}
                >
                    edit
                </button>
            </main>
            {user.gameHistory.length > 0 && (
                <div id="stats">
                    <div>
                        <p>Leaderboard rank : {user.rank}</p>
                        <p>
                            Game played :{" "}
                            {user.winRatio.defeat + user.winRatio.victory}
                        </p>
                        <p>
                            Game win : {user.winRatio.victory} {winPercentage()}
                        </p>
                        <p>
                            Game lose : {user.winRatio.defeat}{" "}
                            {losePercentage()}
                        </p>
                    </div>
                    <div>
                        <ul id="games-list">
                            <h2>Match history</h2>
                            {user.gameHistory.map(
                                (game: any, index: number) => (
                                    <li className="match-results" key={index}>
                                        <div className="winner">
                                            <p>{game.winner}</p>
                                            <p>{game.winner_score}</p>
                                        </div>
                                        <div className="vs">
                                            <p>vs</p>
                                        </div>
                                        <div className="winner">
                                            <p>{game.loser}</p>
                                            <p>{game.loser_score}</p>
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
