export async function leavePrivate(
    data: {
        channel: string;
        username: string;
    },
    chat: any
) {
    let users = chat.users;
    let index = users.findIndex((muted: any) => muted === data.username);
    if (index !== -1) {
        users.splice(index, 1);
        chat.setUsers(users);
    }
}
