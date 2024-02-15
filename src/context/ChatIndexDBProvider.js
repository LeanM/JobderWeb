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

  const handleSelectChat = async (userChatId) => {
    const chat = chats.find((chat) => chat.userChatId === userChatId);
    return chat;
  };

  const handleAddMessagesToChat = async (
    userChatId,
    newChatStatus,
    messages
  ) => {
    const chat = chats.find((chat) => chat.userChatId === userChatId);
    console.log(chat);
    let updatedChat;
    let updatedChatMessages;
    if (chat) {
      console.log("EXISTE");
      updatedChatMessages = [...chat.chatMessages].concat(messages);
      updatedChat = {
        ...chat,
        userChatStatus: newChatStatus,
        chatMessages: updatedChatMessages,
      };

      setChats((prev) => {
        return prev.map((chat) => {
          if (chat.userChatId !== userChatId) return chat;
          else {
            return updatedChat;
          }
        });
      });
    } else {
      updatedChatMessages = messages;
      updatedChat = {
        userChatId: userChatId,
        userChatStatus: newChatStatus,
        chatMessages: updatedChatMessages,
      };
      setChats((prev) => [...prev, updatedChat]);
    }
  };

  useEffect(() => {
    updateIndexDB();
  }, [chats]);

  const updateIndexDB = async () => {
    const db = await openDB("user-chats", 1);
    const tx = db.transaction("chats", "readwrite");
    const store = tx.objectStore("chats");
    chats.map((chat) => {
      store.put(chat);
    });
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
