import LoginLocal from "./LoginLocal";
import Login42 from "./Login42";
import NoAccount from "./NoAccount";
import "../CSS/Login.css";

const Login = () => {
    return (
        <main id="auth-choices">
            <Login42 />
            <h3>or</h3>
            <LoginLocal />
            <NoAccount />
        </main>
    );
};
export default Login;
