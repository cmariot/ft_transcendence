import axios from "axios";

export async function updateFriendAvatar(
    data: { username: string },
    user: any
) {
    if (data.username !== user.username) {
        let friends = user.friends;
        let index = friends.findIndex(
            (friend: any) => friend.username === data.username
        );
        if (index !== -1) {
            try {
                const url = "/api/profile/" + data.username + "/image";
                const avatarResponse = await axios.get(url, {
                    responseType: "blob",
                });
                if (avatarResponse.status === 200) {
                    let imageUrl = URL.createObjectURL(avatarResponse.data);
                    user.friends[index].avatar = imageUrl;
                    user.setFriends(friends);
                }
            } catch (error) {
                console.log(error);
            }
        }
        let blocked = user.blocked;
        index = blocked.findIndex(
            (block: any) => block.username === data.username
        );
        if (index !== -1) {
            try {
                const url = "/api/profile/" + data.username + "/image";
                const avatarResponse = await axios.get(url, {
                    responseType: "blob",
                });
                if (avatarResponse.status === 200) {
                    let imageUrl = URL.createObjectURL(avatarResponse.data);
                    user.blocked[index].avatar = imageUrl;
                    user.setBlocked(blocked);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
