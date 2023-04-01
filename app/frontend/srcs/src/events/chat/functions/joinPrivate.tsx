export async function joinPrivate(
    data: { channel: string; username: string },
    chat: any
) {
    let users = chat.users;
    let index = users.findIndex((user: any) => user === data.username);
    if (index === -1) {
        users.push(data.username);
        chat.setUsers(users);
    }
}
