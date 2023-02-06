import axios from "axios";
import { useState, useEffect } from "react";

export default function FriendsList (props){
	const [friends, setFriends] = useState([]);

  	useEffect(() => {
    	const fetchData = async () => {
      		const result = await axios.get("/api/profile/friend");
      		setFriends(result.data);
			console.log(friends);
    	};
    	fetchData();
  	}, [friends]);

  	return (
    	<div>
			{friends.map(username => <p>{username}</p>)}
    	</div>
  	);
};	