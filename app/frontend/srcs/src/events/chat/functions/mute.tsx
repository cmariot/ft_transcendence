export async function mute(
    data: { channel: string; username: string },
    chat: any
) {
    if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let muted = chat.mutedUsers;
            if (muted.findIndex((mute: any) => mute === data.username) === -1) {
                muted.push(data.username);
                chat.setmutedUsers(muted);
            }
        }
    }
}
