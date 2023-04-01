import axios from "axios";

export async function addAdmins(
    data: { username: string; channel: string },
    chat: any,
    user: any,
    menu: any
) {
    if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let admins = chat.admins;
            admins.push(data.username);
            chat.setAdmins(admins);
        } else if (data.username === user.username) {
            await axios
                .post("/api/chat/connect", {
                    channelName: data.channel,
                })
                .then(function (response: any) {
                    chat.setisChannelAdmin(response.data.channel_admin);
                    chat.setAdmins(response.data.channel_admins);
                    chat.setmutedUsers(response.data.muted_users);
                    chat.setbannedUsers(response.data.banned_users);
                })
                .catch(function (error) {
                    menu.displayError(error.response.data.message);
                });
        }
    }
}
