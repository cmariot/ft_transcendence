import axios from "axios";
import { arrayToMap } from "./arrayToMap";

export async function kick(
    data: { channel: string; username: string },
    user: any,
    chat: any,
    menu: any
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
