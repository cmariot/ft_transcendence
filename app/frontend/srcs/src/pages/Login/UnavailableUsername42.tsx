import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";

const UnavailableUsername42 = () => {
    const navigate = useNavigate();

    return (
        <div className="flex">
            <section id="unavailable-username">
                <h2>Sorry, your username is unavailable,</h2>
                <h3>
                    Please create an account by clicking on the button bellow
                </h3>
                <button onClick={() => navigate("/register")}>register</button>
            </section>
        </div>
    );
};

export default UnavailableUsername42;
