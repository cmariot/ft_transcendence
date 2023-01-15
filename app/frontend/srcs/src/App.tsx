import axios from 'axios';
import './App.css';

function App() {

  let title: string = "ft_transcendence";
  let description: string = "Connect to play Pong versus other players and show everyone how good you are !";

  function testLogin() {
    window.open("https://localhost:4242/api/auth/42", "_self");
  }
  function testRoute() {
    axios.get('https://localhost:4242/api/auth/test');
  }
  function testLogout() {
    axios.get('https://localhost:4242/api/auth/logout');
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <button onClick={testLogin}>Login</button>
      <button onClick={testRoute}>Test</button>
      <button onClick={testLogout}>Logout</button>
    </div>
  );

}

export default App;
