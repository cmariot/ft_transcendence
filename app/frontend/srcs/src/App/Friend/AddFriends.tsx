import axios from "axios";
import { useState } from "react";

export default function AddFriends (props){
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/profile/addFriend", { username });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				<button type="submit">Add Friend</button>
			</form>
		</div>
	);
} 
