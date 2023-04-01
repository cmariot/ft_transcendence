import axios from "axios";
import { arrayToMap } from "./arrayToMap";

export async function unban(
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
    } else if (chat.channel === data.channel) {
        if (chat.isChannelAdmin === true || chat.isChannelOwner === true) {
            let banned = chat.bannedUsers;
            let index = banned.findIndex(
                (banned: any) => banned === data.username
            );
            if (index !== -1) {
                banned.splice(index, 1);
                chat.setbannedUsers(banned);
            }
        }
    }
}
