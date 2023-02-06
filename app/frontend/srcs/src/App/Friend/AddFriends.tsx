import axios from "axios";
import { useState, useEffect} from "react";
import { textChangeRangeIsUnchanged } from "typescript";

export default function AddFriends (props){
	const [username, setUsername] = useState("");
	const [friends, setFriends] = useState([]);
	const [bool, setBool] = useState(false);


	const handleSubmit = async (e) => {
		e.preventDefault();
		await axios
            .post("/api/profile/friend", {
                username
            })
            .then((response) => {
				console.log(response);
				setBool(!bool);
            })
            .catch((error) => {
                console.log(error);
            });
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get("/api/profile/friend");
			setFriends(result.data);
			console.log(friends);
		};
		fetchData();
	}, [friends, bool]);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				<button type="submit">Add Friend</button>
			</form>
		{friends.map(username => <p>{username}</p>)}
		</div>
	);
} 