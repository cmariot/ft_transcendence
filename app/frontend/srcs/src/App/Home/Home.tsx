import { useEffect } from "react";
import "../CSS/Home.css";
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
