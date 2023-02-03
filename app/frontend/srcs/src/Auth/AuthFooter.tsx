import { Link } from "react-router-dom";
import "./CSS/AuthFooter.css";

const AuthFooter = () => {
    return (
        <footer id="auth-footer">
            <p>Test protected routes :</p>
            <Link to="/">Test Home</Link>
            <Link to="/double-auth">DoubleAuth</Link>
            <Link to="/validate">Validate</Link>
        </footer>
    );
};
export default AuthFooter;
