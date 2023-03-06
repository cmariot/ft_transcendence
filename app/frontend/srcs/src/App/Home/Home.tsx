import "../CSS/Home.css";
import Chat from "./Chat/Chat";
import Game from "./Game/Game";

const Home = () => {
    // Aimen
    return (
        <main id="home-main">
            <Game />
            <Chat />
        </main>
    );
};
export default Home;
