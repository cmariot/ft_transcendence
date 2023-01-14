import React from 'react';
import axios from 'axios';
import './App.css';

function App() {

  let title: string = "ft_transcendence";
  let description: string = "Connect to play Pong versus other players and show everyone how good you are !";

  async function handleClick() {
    window.open("https://localhost:4242/api/auth/42", "_self");
  }
  async function testLogin() {
    await console.log(axios.get('https://localhost:4242/api/auth/test'));
  }
  async function testLogout() {
    console.log(axios.get('https://localhost:4242/api/auth/logout'));
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <button onClick={handleClick}>Login</button>
      <button onClick={testLogin}>test login</button>
      <button onClick={testLogout}>Logout</button>
    </div>
  );

}

export default App;
