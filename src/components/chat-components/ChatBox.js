import { useContext, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import Message from "./Message";
import { colors } from "../../assets/colors";
import React, { forwardRef, useImperativeHandle } from "react";
import { format } from "date-fns";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ChatIndexDBContext from "../../context/ChatIndexDBProvider";

const ChatBox = forwardRef((props, ref) => {
  const { actualRecipientId, onSendMessage } = props;
  const { handleSelectChat } = useContext(ChatIndexDBContext);
  const [inputText, setInputText] = useState("");
  const [lastMessageDate, setLastMessageDate] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const [messageDisplay, setMessageDisplay] = useState([]);

  const messageContainerRef = useRef(null);

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    addMessages,
    verifyUpcomingMessage,
  }));

  useEffect(() => {
    obtainChatMessages();
  }, [actualRecipientId]);

  const obtainChatMessages = async () => {
    if (actualRecipientId !== "") {
      const chat = await handleSelectChat(actualRecipientId);
      if (chat?.chatMessages) addMessages(true, chat?.chatMessages);
    }
  };

  useEffect(() => {
    scrollDown();
  }, [messageDisplay]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleMessage = () => {
    let newMessage = onSendMessage(inputText);
    addMessages(false, [newMessage]);

    setInputText("");
  };

  const addMessages = (reset, messages) => {
    let addedDisplay = [];
    let previousDate = lastMessageDate;
    messages.map((message) => {
      const messageTimestamp = new Date(
        format(message?.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
      );
      const year = messageTimestamp.getFullYear();
      const month = ("0" + (messageTimestamp.getMonth() + 1)).slice(-2); // Suma 1 ya que los meses van de 0 a 11
      const day = ("0" + messageTimestamp.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      if (formattedDate !== previousDate) {
        previousDate = formattedDate;
        addedDisplay.push(
          <div key={addedDisplay.length} className={classes.timeContainer}>
            <span style={{ color: colors.white }}>{formattedDate}</span>
          </div>
        );
        if (message?.recipientId === actualRecipientId) {
          addedDisplay.push(
            <Message
              key={addedDisplay.length}
              type="sender"
              messageData={message}
            />
          );
        } else {
          addedDisplay.push(
            <Message
              key={addedDisplay.length}
              type="receiver"
              messageData={message}
            />
          );
        }
      } else {
        if (message.recipientId === actualRecipientId) {
          addedDisplay.push(
            <Message
              key={addedDisplay.length}
              type="sender"
              messageData={message}
            />
          );
        } else {
          addedDisplay.push(
            <Message
              key={addedDisplay.length}
              type="receiver"
              messageData={message}
            />
          );
        }
      }
    });

    if (reset) setMessageDisplay(addedDisplay);
    else setMessageDisplay([...messageDisplay, addedDisplay]);

    setLastMessageDate(previousDate);
  };

  const verifyUpcomingMessage = (newMessage) => {
    return newMessage.senderId === actualRecipientId;
  };

  const scrollDown = () => {
    if (messageContainerRef.current) {
      const scrollHeight = messageContainerRef.current.scrollHeight;
      messageContainerRef.current.scrollTop += scrollHeight; // Puedes ajustar el valor según tus necesidades
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.messagesContainer} ref={messageContainerRef}>
        {messageDisplay}
      </div>
      <div className={classes.inputContainer}>
        <input
          value={inputText}
          className={classes.input}
          onChange={(e) => handleInputChange(e)}
          placeholder="Envia un mensaje..."
          type="text"
        ></input>
        <button className={classes.sendButton} onClick={() => handleMessage()}>
          Enviar
        </button>
      </div>
    </div>
  );
});

export default ChatBox;

const useStyles = createUseStyles({
  container: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  messagesContainer: {
    width: "90%",
    height: "85%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "none",
  },
  timeContainer: {
    width: "60%",
    height: "3rem",
    display: "flex",
    marginBottom: "1rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    borderBottom: "solid 1px " + colors.secondary,
  },
  inputContainer: {
    width: "90%",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: `solid 1px ${colors.secondary}`,
    borderRadius: "100px",
    gap: "1rem",
  },
  input: {
    width: "80%",
    borderRadius: "0 !important",
    outline: "none",
    border: "none",
    color: colors.white,
    backgroundColor: colors.primary,
    //borderBottom: `solid 1px ${colors.secondary}`,
  },
  sendButton: {
    height: "2rem",
    //borderRadius: "10px",
    backgroundColor: colors.primary,
    //borderBottom: "solid 1px " + colors.secondary,
    color: colors.white,
    fontWeight: "300",
  },
});
