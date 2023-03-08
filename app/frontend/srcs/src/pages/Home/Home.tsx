import "../../styles/Home.css";
import "../../styles/Chat.css";
import "../../styles/Theme.css";
import Chat from "./Chat/Chat";
import Game from "./Game/Game";

const Home = () => {
    return (
        <main id="home-main">
            <Game />
            <Chat />
        </main>
    );
};

export default Home;
