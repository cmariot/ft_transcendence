import axios from "axios";

export async function updateMessages(chat: any) {
    try {
        const messageResponse = await axios.post("/api/chat/messages", {
            channelName: chat.channel,
        });
        if (messageResponse.status === 201) {
            chat.setMessages(messageResponse.data.messages);
        }
    } catch (error) {
        console.log(error);
    }
}
