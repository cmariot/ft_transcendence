import "../../styles/Profile.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();

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
            <div id="stats">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
