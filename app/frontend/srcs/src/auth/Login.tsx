import AuthFooter from "./footer/AuthFooter";
import AuthNavbar from "./navbar/AuthNavbar";
import LoginLocal from "./login/LoginLocal";
import Login42 from "./login/Login42";
import NoAccount from "./login/NoAccount";
import './Login.css';

const Login = () => {
    return (
        <main>
            <AuthNavbar />
            <main id="auth-choices">
                <Login42 />
                <h3>or</h3>
                <LoginLocal />           
                <NoAccount />
            </main>
            <AuthFooter />
        </main>
    );
}
export default Login;