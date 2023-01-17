import axios from 'axios';
import './App.css';
import RegistrationForm from './RegisterForm';

function App() {

  let title: string = "ft_transcendence";
  let description: string = "Connect to play Pong versus other players and show everyone how good you are !";

  function testLogin() {
    window.open("https://localhost:8443/api/auth/42", "_self");
  }
  function testRoute() {
    axios.get('https://localhost:8443/api//auth/test');
  }
  function testLogout() {
    axios.get('https://localhost:8443/api/auth/logout');
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <div>
        <button onClick={testLogin}>Login with 42</button>
        <button onClick={testRoute}>Test</button>
        <button onClick={testLogout}>Logout</button>
      </div>
        <RegistrationForm />
    </div>
  );

}

export default App;
