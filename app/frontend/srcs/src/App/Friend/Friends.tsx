import { useOutletContext } from "react-router-dom";
import AddFriends from "./AddFriends"

const Friends = (props) => {
    return (
        <main>
			<h2>Add Friends</h2>
			<AddFriends userProps={useOutletContext()} />
        </main>
    );
};
export default Friends;