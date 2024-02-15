import { createContext, useEffect, useState } from "react";
import { openDB } from "idb";

const ChatIndexDBContext = createContext({});

export const ChatIndexDBProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});

  useEffect(() => {
    async function fetchChats() {
      const db = await openDB("user-chats", 1, {
        upgrade(db) {
          const store = db.createObjectStore("chats", {
            keyPath: "userChatId",
          });
        },
      });

      const tx = db.transaction("chats", "readonly");
      const store = tx.objectStore("chats");
      const chats = await store.getAll();
      setChats(chats);
    }

    fetchChats();
  }, []);

  const existsUserChat = (userChatId) => {
    return chats.find((chat) => chat.userChatId === userChatId);
  };

  const handleSelectChat = (userChatId) => {
    const chat = chats.find((chat) => chat.userChatId === userChatId);
    setCurrentChat(chat);
    return chat;
  };

  const handleAddMessagesToChat = async (userChatId, messages) => {
    const chat = chats.find((chat) => chat.userChatId === userChatId);
    let updatedChat;
    let updatedChatMessages;
    if (chat) {
      updatedChatMessages = [...chat.chatMessages, messages];
      updatedChat = { ...chat, chatMessages: updatedChatMessages };
    } else {
      updatedChatMessages = messages;
      updatedChat = {
        userChatId: userChatId,
        chatMessages: updatedChatMessages,
      };
    }
    const db = await openDB("user-chats", 1);
    const tx = db.transaction("chats", "readwrite");
    const store = tx.objectStore("chats");
    await store.put(updatedChat);
    setCurrentChat(updatedChat);
  };

  return (
    <ChatIndexDBContext.Provider
      value={{
        currentChat,
        handleSelectChat,
        handleAddMessagesToChat,
        existsUserChat,
      }}
    >
      {children}
    </ChatIndexDBContext.Provider>
  );
};

export default ChatIndexDBContext;
