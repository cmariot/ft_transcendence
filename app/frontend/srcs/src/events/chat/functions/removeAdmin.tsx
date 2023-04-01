import axios from "axios";

export async function removeAdmins(
    data: {
        username: string;
        channel: string;
    },
    chat: any,
    user: any,
    menu: any
) {
    if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let admins = chat.admins;
            let index = admins.findIndex(
                (admins: any) => admins === data.username
            );
            if (index !== -1) {
                admins.splice(index, 1);
                chat.setAdmins(admins);
            }
        }
        if (data.username === user.username) {
            try {
                const connectResponse = await axios.post("/api/chat/connect", {
                    channelName: data.channel,
                });
                if (connectResponse.status === 201) {
                    chat.setisChannelAdmin(connectResponse.data.channel_admin);
                    chat.setAdmins(connectResponse.data.channel_admins);
                    chat.setmutedUsers(connectResponse.data.muted_users);
                    chat.setbannedUsers(connectResponse.data.banned_users);
                }
            } catch (connectResponse: any) {
                menu.displayError(connectResponse.response.data.message);
            }
        }
    }
}
