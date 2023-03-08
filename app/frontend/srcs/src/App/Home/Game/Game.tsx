import React, { useState } from "react";
import axios from "axios";

const Game = () => {
    const handleButtonClick = async () => {
        try {
            const response = await axios.post("/api/game/queue", {
                username: "Milou",
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div id="Game">
            <button onClick={handleButtonClick}>Envoyer</button>
        </div>
    );
};

export default Game;
