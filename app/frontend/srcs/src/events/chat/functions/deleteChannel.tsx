import axios from "axios";
import { arrayToMap } from "./arrayToMap";

export async function deleteChannels(data: { channel: string }, chat: any) {
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
}
