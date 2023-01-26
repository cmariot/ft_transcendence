import { useNavigate } from "react-router-dom";

function Login42() {
    const navigate = useNavigate();

    function login42() {
        try {
            window.open("/api/auth/42", "_self");
        } catch (e) {
            console.error(e);
            navigate("/login");
        }
    }

    return (
        <div>
            <h2>Login with your 42 account</h2>
            <button className="button" onClick={login42}>
                Login
            </button>
        </div>
    );
}

export default Login42;
