import { useContext } from "react";
import "../../styles/Friends.css";
import { UserContext } from "../../Contexts/UserProvider";
import AddFriend from "./AddFriend";
import FriendsList from "./FriendsList";
import BlockedList from "./BlockedList";

export default function Friends() {
    let user = useContext(UserContext);

    return (
        <div id="friends">
            <AddFriend />

            <main id="friend-list-main">
                {!user.friends.length && !user.blocked.length && (
                    <p>Let's add some friends !</p>
                )}
                {user.friends.length && <FriendsList />}
                {user.blocked.length && <BlockedList />}
            </main>
        </div>
    );
}
