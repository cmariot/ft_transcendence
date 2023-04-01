export function updateStatus(
    data: { username: string; status: string },
    user: any
) {
    if (data.username === user.username) {
        user.setStatus(data.status);
    } else {
        let friends = user.friends;
        const index = friends.findIndex(
            (friend: any) => friend.username === data.username
        );
        if (index !== -1 && friends[index].status !== data.status) {
            friends[index].status = data.status;
            user.setFriends(friends);
        }
    }
}
