import axios from 'axios';
import { useState, useEffect} from "react";

export default  function AddFriends (props){
	const [username, setUsername] = useState("");
	const [friends, setFriends] = useState([]);
	const [refresh, setRefresh] = useState(false);

	const handleSubmit = async (event) => {
	  event.preventDefault();
	  await axios
            .post("https://localhost:8443/api/profile/friend", {
                username: username,
            })
            .then(function (response) {
				setRefresh(!refresh);
            })
            .catch(function (error) {
				console.log(error);
            });
	};
  
	useEffect(() => {
	  const fetchData = async () => {
		await axios
            .get("https://localhost:8443/api/profile/friend",)
            .then(function (response) {
				console.log(response);
				setFriends(response.data);
            })
            .catch(function (error) {
				console.log(error);
            });
	  };
	  fetchData();
	}, [refresh]);
  
	return (
	  <div>
		<form onSubmit={handleSubmit}>
		  <input
			type="text"
			value={username}
			onChange={event => setUsername(event.target.value)}
		  />
		  <button type="submit">Add Friend</button>
		</form>
		<ul>
		  {friends.map((friend, index) => (
			<li key={index}>{friend}</li>
		  ))}
		</ul>
	  </div>
	);
};