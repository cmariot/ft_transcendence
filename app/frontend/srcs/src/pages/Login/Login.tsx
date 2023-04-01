import LoginLocal from "./LoginLocal";
import Login42 from "./Login42";
import NoAccount from "./NoAccount";
import "../../styles/Login.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user/UserContext";

const Login = () => {
    const user = useContext(UserContext);

    useEffect(() => {
        if (user.isForcedLogout) {
            user.setIsForcedLogout(false);
        }
    }, [user]);

    return (
        <section id="auth-content">
            <article>
                <h2>Welcome to ft_transcendence</h2>
                <h3>Let's play pong !</h3>
                <p>You must log in to access the website</p>
            </article>
            <aside id="login-pannel">
                <Login42 />
                <NoAccount />
                <LoginLocal />
            </aside>
        </section>
    );
};
export default Login;
