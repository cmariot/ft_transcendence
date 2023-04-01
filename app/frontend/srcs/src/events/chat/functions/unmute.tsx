export async function unmute(
    data: { channel: string; username: string },
    chat: any
) {
    if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let muted = chat.mutedUsers;
            let index = muted.findIndex(
                (muted: any) => muted === data.username
            );
            if (index !== -1) {
                muted.splice(index, 1);
                chat.setmutedUsers(muted);
            }
        }
    }
}
