import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function Home() {

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

function App() {

  const [isLogged, setIsLogged] = useState(false);

  let title: string = "ft_transcendence";
  let description: string = "Connect to play Pong versus other players and show everyone how good you are !";

  async function handleClick() {
    try {
      const res = await axios({
        method: 'get',
		  url: "https://localhost:8080/api/login",
      })
      await console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLogged === false) {
    return (
      <div>
        <h1>{title}</h1>
        <h2>{description}</h2>
        <button onClick={handleClick}>Login</button>
      </div>
    );
  }
  else {
    return (
      <div>
        <Home />
      </div>
    );
  }

}

export default App;
