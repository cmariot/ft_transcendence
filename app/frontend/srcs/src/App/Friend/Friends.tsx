import { useOutletContext } from "react-router-dom";
import FriendsList from "./FriendsList";
import AddFriends from "./AddFriends"

const Friends = (props) => {
    return (
        <main>
			<h2>Add Friends</h2>
			<AddFriends userProps={useOutletContext()} />
            <h2>Friends List</h2>
			<FriendsList userProps={useOutletContext()} />
        </main>
    );
};
export default Friends;