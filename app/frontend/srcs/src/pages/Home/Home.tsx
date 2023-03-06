import "../../styles/Home.css";
import "../../styles/Chat.css";
import "../../styles/Theme.css";
import Chat from "./Chat/Chat";

const Home = () => {
    return (
        <main id="home-main">
            <div id="game">Game</div>
            <Chat />
        </main>
    );
};
export default Home;
