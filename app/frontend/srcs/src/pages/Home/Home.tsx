import "../../styles/Home.css";
import "../../styles/Chat.css";
import "../../styles/Theme.css";
import Chat from "./Chat/Chat";

const Home = () => {
    console.log("Home");

    return (
        <main id="home-main">
            <div id="game">Game</div>
            <div id="chat">Chat</div>
            {/* <Chat /> */}
        </main>
    );
};
export default Home;
