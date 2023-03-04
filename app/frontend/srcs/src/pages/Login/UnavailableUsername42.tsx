import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";

const UnavailableUsername42 = () => {
  const navigate = useNavigate();

  function redirectRegister() {
    navigate("/register");
  }

  return (
    <section id="unavailable-username">
      <h2>Sorry, your username is unavailable,</h2>
      <h3>Please create an account by clicking on the button bellow</h3>
      <button onClick={() => redirectRegister()}>register</button>
    </section>
  );
};
export default UnavailableUsername42;
