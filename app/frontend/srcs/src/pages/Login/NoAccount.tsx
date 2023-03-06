import { useNavigate } from "react-router-dom";

function NoAccount() {
    const navigate = useNavigate();

    return (
        <div>
            <h3>You don't have an account ?</h3>
            <button className="button" onClick={() => navigate("/register")}>
                Create one
            </button>
        </div>
    );
}

export default NoAccount;
