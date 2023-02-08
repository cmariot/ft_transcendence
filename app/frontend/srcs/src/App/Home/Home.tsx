import "../CSS/Home.css";
import Chat from "./Chat";

const Home = (props: any) => {
    return (
        <main id="home-main">
            <div id="game">Game</div>
            <Chat />
        </main>
    );
};
export default Home;
