import { useNavigate } from "react-router-dom";

function NoAccount() {

    const navigate = useNavigate();
	function register() {
        navigate('/register')
    }

	return (
		<div>
			<h2>You don't have an account ?</h2>
			<button onClick={register}>Create one</button>
		</div>
	)
}

export default NoAccount;