import { ChangeEvent, useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatParent";

const AddUser = () => {
  const chat = useContext(ChatContext);
  const [newUser, setNewUser] = useState("");

  function handleNewUser(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { id, value } = event.target;
    if (id === "new-user-private-channel") {
      setNewUser(value);
    }
  }

  function returnToChatMenu() {
    const current = document.getElementById("add-user-menu");
    const menu = document.getElementById("chat-conversation");
    if (menu && current) {
      current.style.display = "none";
      menu.style.display = "flex";
    }
  }

  async function addNewUser(event: any) {
    event.preventDefault();
    await axios
      .post("/api/chat/private/add-user", {
        username: newUser,
        channelName: chat.currentChannel,
      })
      .then((response) => {
        chat.setCurrentChannelUsers(response.data);
        setNewUser("");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  async function kickUser(username: string) {
    await axios
      .post("/api/chat/kick", {
        channelName: chat.currentChannel,
        username: username,
      })
      .then((response) => {
        if (chat.currentChannelType === "privateChannel") {
          chat.setCurrentChannelUsers(response.data);
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  function currentUsers() {
    if (chat.currentChannelUsers.length) {
      return (
        <ul id="channel-users-list">
          <p>Channel users :</p>
          {chat.currentChannelUsers.map((user, index) => (
            <li className="admin-channel" key={index}>
              <p className="admin-channel-username">{user}</p>
              <button onClick={() => kickUser(user)}>kick</button>
            </li>
          ))}
        </ul>
      );
    } else return <p>You are alone in this channel.</p>;
  }

  return (
    <menu id="add-user-menu" className="chat-menu">
      <header className="chat-header">
        <p className="chat-header-tittle">Add User</p>
        <button onClick={() => returnToChatMenu()}>return</button>
      </header>
      <section className="chat-section">
        <form onSubmit={(event) => addNewUser(event)} autoComplete="off">
          <input
            type="text"
            id="new-user-private-channel"
            onChange={handleNewUser}
            value={newUser}
            placeholder="new username"
          />
          <button type="submit" value="add">
            add
          </button>
        </form>
        {currentUsers()}
      </section>
      <footer className="chat-footer"></footer>
    </menu>
  );
};

export default AddUser;
