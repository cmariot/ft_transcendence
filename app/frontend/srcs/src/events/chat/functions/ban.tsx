import axios from "axios";
import { arrayToMap } from "./arrayToMap";

export async function ban(
    data: { channel: string; username: string },
    user: any,
    chat: any
) {
    if (data.username === user.username) {
        try {
            const channelsResponse = await axios.get("/api/chat/channels");
            if (channelsResponse.status === 200) {
                chat.updateUserChannels(
                    arrayToMap(channelsResponse.data.userChannels)
                );
                chat.updateUserPrivateChannels(
                    arrayToMap(channelsResponse.data.userPrivateChannels)
                );
                chat.updateAvailableChannels(
                    arrayToMap(channelsResponse.data.availableChannels)
                );
            }
        } catch (error) {
            console.log(error);
        }
        if (chat.channel === data.channel) {
            chat.setMessages([]);
            chat.setChannel("");
            chat.setChannelType("");
            chat.setmutedUsers([]);
            chat.setbannedUsers([]);
            chat.closeMenu();
            chat.setPage("YourChannels");
        }
    } else if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let banned = chat.bannedUsers;
            if (banned.findIndex((ban: any) => ban === data.username) === -1) {
                banned.push(data.username);
                chat.setmutedUsers(banned);
            }
        }
    }
}
