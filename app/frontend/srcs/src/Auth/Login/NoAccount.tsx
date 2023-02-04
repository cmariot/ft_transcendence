import { useNavigate } from "react-router-dom";

function NoAccount() {
    const navigate = useNavigate();
    function register() {
        navigate("/register");
    }

    return (
        <div>
            <h3>You don't have an account ?</h3>
            <button className="button" onClick={register}>
                Create one
            </button>
        </div>
    );
}

export default NoAccount;
