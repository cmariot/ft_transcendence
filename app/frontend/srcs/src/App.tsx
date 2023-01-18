import axios from 'axios';
import './App.css';
import RegistrationForm from './RegisterForm';
import LoginForm from './LoginForm';

function App() {

  let title: string = "ft_transcendence";
  let description: string = "Connect to play Pong versus other players and show everyone how good you are !";

  function testLogin() {
    window.open("https://localhost:8443/api/auth/42", "_self");
  }
  function testLogout() {
    axios.get('https://localhost:8443/api/logout');
  }
  function getProfile() {
    axios.get('https://localhost:8443/api/profile');
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <div>
        <button onClick={testLogin}>Login with 42</button>
        <button onClick={testLogout}>Logout</button>
      </div>
      <div id="register_login">
        <RegistrationForm />
        <LoginForm />
      </div>
      <button onClick={getProfile}>Profile</button>
    </div>
  );

}

export default App;
