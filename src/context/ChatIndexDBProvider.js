import { createContext, useEffect } from "react";
import { openDB } from "idb";

const ChatIndexDBContext = createContext({});

export const ChatIndexDBProvider = ({ children }) => {
  useEffect(() => {
    startDB();
  }, []);

  const startDB = async () => {
    const db = await openDB("user-chats", 1, {
      upgrade(db) {
        const store = db.createObjectStore("chats", {
          keyPath: "userChatId",
        });
      },
    });

    return db;
  };

  const openDBtoWrite = async () => {
    const db = await startDB();
    const tx = db.transaction("chats", "readwrite");
    return tx.objectStore("chats");
  };

  const openDBtoRead = async () => {
    const db = await startDB();
    const tx = db.transaction("chats", "readonly");
    return tx.objectStore("chats");
  };

  const cleanUpDeprecatedChatRoomUsers = async (actualChatrooms) => {
    const store = await openDBtoWrite();
    const chats = await store.getAll();

    chats.map((chat) => {
      let isDeprecated = true;
      actualChatrooms.every((chatroom) => {
        if (chatroom?.user?.id === chat?.userChatId) {
          isDeprecated = false;
          return false;
        } else return true;
      });
      if (isDeprecated) store.delete(chat?.userChatId);
    });
  };

  const handleSelectChat = async (userChatId) => {
    const store = await openDBtoWrite();
    let chat = await store.get(userChatId);

    if (chat) {
      let updatedChat = { ...chat, userChatStatus: "SEEN" };
      store.put(updatedChat);
    }

    return chat;
  };

  const handleDeleteChat = async (userChatId) => {
    const store = await openDBtoWrite();
    await store.delete(userChatId);
  };

  const obtainChatUserState = async (userChatId) => {
    const read = await openDBtoRead();
    const chat = await read.get(userChatId);

    return chat.userChatStatus;
  };

  const verifyMessageQuantity = async (userChatId, validMessagesQuantity) => {
    const read = await openDBtoRead();
    const chat = await read.get(userChatId);

    if (chat) return chat?.chatMessages?.length === validMessagesQuantity;
    else return false;
  };

  const handleRefreshChat = async (userChatRoom, messages) => {
    const store = await openDBtoWrite();
    let updatedChat = {
      userChatId: userChatRoom.user.id,
      userChatStatus: userChatRoom.chatRoom.state,
      chatMessages: messages,
    };
    store.put(updatedChat);
  };

  const handleUpdateChat = async (userChatRoom, messages) => {
    const store = await openDBtoWrite();
    const chat = await store.get(userChatRoom.user.id);
    let updatedChat;
    let updatedChatMessages;
    if (chat) {
      updatedChatMessages = [...chat.chatMessages].concat(messages);
      /*
      let verifiedChatMessages = verifyMessagesConsistency(
        updatedChatMessages,
        userChatRoom.chatRoom.messageQuantity
      );
      */
      updatedChat = {
        ...chat,
        userChatStatus: userChatRoom.chatRoom.state,
        chatMessages: updatedChatMessages,
      };
    } else {
      updatedChatMessages = messages;
      /*
      let verifiedChatMessages = verifyMessagesConsistency(
        updatedChatMessages,
        userChatRoom.chatRoom.messageQuantity
      );
      */
      updatedChat = {
        userChatId: userChatRoom.user.id,
        userChatStatus: userChatRoom.chatRoom.state,
        chatMessages: updatedChatMessages,
      };
    }

    //En un futuro verificar que no se repitan y que esten en orden
    verifyMessageQuantity(
      updatedChat.userChatId,
      userChatRoom.chatRoom.messageQuantity
    ).then((correctMessageQuantity) => {
      if (correctMessageQuantity) {
        try {
          store.put(updatedChat);
          return true;
        } catch {
          return false;
        }
      } else return false;
    });
  };

  const handleUpdateChatRoomStatus = async (userChatId, newStatus) => {
    const store = await openDBtoWrite();
    const chat = await store.get(userChatId);
    if (chat) {
      let updatedChatRoom = { ...chat, userChatStatus: newStatus };
      store.put(updatedChatRoom);
    }
  };

  const handleMessageSent = async (userChatId, message) => {
    const store = await openDBtoWrite();
    const chat = await store.get(userChatId);
    let updatedChat;
    let updatedChatMessages;
    if (chat) {
      updatedChatMessages = [...chat.chatMessages, message];
      updatedChat = {
        ...chat,
        userChatStatus: "SEEN",
        chatMessages: updatedChatMessages,
      };
      store.put(updatedChat);
    }
  };

  const handleMessageReceived = async (userChatId, onChat, message) => {
    const store = await openDBtoWrite();
    const chat = await store.get(userChatId);
    let updatedChat;
    let updatedChatMessages;
    if (chat && !verifyExistsMessage(chat?.chatMessages, message.id)) {
      updatedChatMessages = [...chat.chatMessages, message];
      updatedChat = {
        ...chat,
        userChatStatus: onChat ? "SEEN" : "UNSEEN",
        chatMessages: updatedChatMessages,
      };
      store.put(updatedChat);
    }
  };

  const verifyExistsMessage = (chatMessages, messageId) => {
    let existsMessage = false;
    chatMessages.every((message) => {
      if (message.id === messageId) {
        existsMessage = true;
        return false;
      }
      return true;
    });

    return existsMessage;
  };

  const verifyMessagesConsistency = (chatMessages, validMessageQuantity) => {
    let cleanedMessages = [];
    let previousId = "";
    chatMessages.map((message) => {
      if (message.id !== previousId) {
        previousId = message.id;
        cleanedMessages.push(message);
      }
    });

    let sortedMessages = cleanedMessages.sort(
      (a, b) =>
        new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
    );

    if (sortedMessages.length === validMessageQuantity) {
      return sortedMessages;
    } else return false;
  };

  return (
    <ChatIndexDBContext.Provider
      value={{
        handleSelectChat,
        handleUpdateChat,
        handleMessageSent,
        handleMessageReceived,
        verifyMessageQuantity,
        handleRefreshChat,
        obtainChatUserState,
        handleDeleteChat,
        handleUpdateChatRoomStatus,
        cleanUpDeprecatedChatRoomUsers,
      }}
    >
      {children}
    </ChatIndexDBContext.Provider>
  );
};

export default ChatIndexDBContext;
