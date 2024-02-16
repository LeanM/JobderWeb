import { createContext, useEffect } from "react";
import { openDB } from "idb";

const ChatIndexDBContext = createContext({});

export const ChatIndexDBProvider = ({ children }) => {
  useEffect(() => {
    async function fetchChats() {
      const db = await openDB("user-chats", 1, {
        upgrade(db) {
          const store = db.createObjectStore("chats", {
            keyPath: "userChatId",
          });
        },
      });
    }
    fetchChats();
  }, []);

  const handleSelectChat = async (userChatId) => {
    const db = await openDB("user-chats", 1);
    const tx = db.transaction("chats", "readonly");
    const store = tx.objectStore("chats");
    const chat = await store.get(userChatId);
    return chat;
  };

  const handleAddMessagesToChat = async (
    userChatId,
    newChatStatus,
    messages
  ) => {
    const db = await openDB("user-chats", 1);
    const tx = db.transaction("chats", "readwrite");
    const store = tx.objectStore("chats");
    const chat = await store.get(userChatId);
    let updatedChat;
    let updatedChatMessages;
    if (chat) {
      updatedChatMessages = [...chat.chatMessages].concat(messages);
      updatedChat = {
        ...chat,
        userChatStatus: newChatStatus,
        chatMessages: updatedChatMessages,
      };
    } else {
      updatedChatMessages = messages;
      updatedChat = {
        userChatId: userChatId,
        userChatStatus: newChatStatus,
        chatMessages: updatedChatMessages,
      };
    }
    store.put(updatedChat);
  };

  const verifyMessagesConsistency = (chat) => {
    let sortedMessages = chat?.chatMessages.sort(
      (a, b) =>
        new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
    );
  };

  return (
    <ChatIndexDBContext.Provider
      value={{
        handleSelectChat,
        handleAddMessagesToChat,
      }}
    >
      {children}
    </ChatIndexDBContext.Provider>
  );
};

export default ChatIndexDBContext;
