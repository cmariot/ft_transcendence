import axios from "axios";
import { arrayToMap } from "./arrayToMap";

export async function updateChannels(chat: any, menu: any) {
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
    } catch (error: any) {
        menu.displayError(error.response.data.message);
    }
}
