import "../../styles/Profile.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    function winPercentage() {
        if (user.winRatio.victory + user.winRatio.defeat > 0) {
            return (
                "(" +
                (
                    (user.winRatio.victory /
                        (user.winRatio.victory + user.winRatio.defeat)) *
                    100
                ).toString() +
                "%)"
            );
        }
        return null;
    }

    function losePercentage() {
        if (user.winRatio.victory + user.winRatio.defeat > 0) {
            return (
                "(" +
                (
                    (user.winRatio.victory /
                        (user.winRatio.victory + user.winRatio.defeat)) *
                    100
                ).toString() +
                "%)"
            );
        }
        return null;
    }

    console.log(user.gameHistory);

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
                    onClick={() => {
                        navigate("/settings");
                    }}
                >
                    edit
                </button>
            </main>
            <div id="profile">
                <div>
                    <p>
                        Game played :{" "}
                        {user.winRatio.defeat + user.winRatio.victory}
                    </p>
                    <p>
                        Game win : {user.winRatio.victory} {winPercentage()}
                    </p>
                    <p>
                        Game lose : {user.winRatio.defeat} {losePercentage()}
                    </p>
                </div>
                <div>
                    {user.gameHistory.length && (
                        <ul id="games-list">
                            <h2>Games list</h2>
                            {user.gameHistory.map(
                                (game: any, index: number) => (
                                    <li className="friend" key={index}>
                                        <p>Winner : {game.winner}</p>
                                        <p>Loser : {game.loser}</p>
                                        <p>
                                            Score : {game.winner_score} vs{" "}
                                            {game.loser_score}
                                        </p>
                                    </li>
                                )
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
