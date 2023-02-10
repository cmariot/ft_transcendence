import "../../CSS/Chat.css";

const ChatMessages = (props: any) => {
    return (
        <>
            <ul id="chat-main-ul">
                {props.context.channelMessages.map((item: any, index: any) => (
                    <li className="chat-main-li" key={index}>
                        <p className="chat-menu-channel">{item.username} : </p>
                        <p className="chat-menu-channel">{item.message}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};
export default ChatMessages;
