import axios from "axios";
import { useState, useEffect } from "react";

export default function FriendsList (props){
	const [friends, setFriends] = useState([]);
	const [bool, setBool] = useState(false);

  	useEffect(() => {
    	const fetchData = async () => {
      		const result = await axios.get("/api/profile/friend");
			setBool(!bool);
      		setFriends(result.data);
			console.log(friends);
    	};
    	fetchData();
  	}, [friends, bool]);

  	return (
    	<div>
			{friends.map(username => <p>{username}</p>)}
    	</div>
  	);
};	