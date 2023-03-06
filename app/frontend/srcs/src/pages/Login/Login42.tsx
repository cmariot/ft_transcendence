import { useNavigate } from "react-router-dom";

function Login42() {
    const navigate = useNavigate();

    function login42() {
        try {
            window.open("/api/auth/42", "_self");
        } catch (error) {
            navigate("/login");
            console.error(error);
        }
    }

    return (
        <div>
            <h3>Login with your 42 account</h3>
            <button className="button" onClick={login42}>
                Login with 42
            </button>
        </div>
    );
}

export default Login42;
