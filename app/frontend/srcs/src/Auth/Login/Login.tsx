import LoginLocal from "./LoginLocal";
import Login42 from "./Login42";
import NoAccount from "./NoAccount";
import "../CSS/Login.css";

const Login = () => {
    return (
        <>
            <section id="auth-content">
                <article>
                    <h2>Welcome to ft_transcendence</h2>
                    <p>You must log in to access the site</p>
                </article>
                <aside id="login-pannel">
                    <Login42 />
                    <NoAccount />
                    <LoginLocal />
                </aside>
            </section>
        </>
    );
};
export default Login;
