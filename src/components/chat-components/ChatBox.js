import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import Message from "./Message";
import axios from "axios";
import { colors } from "../../assets/colors";
import React, { forwardRef, useImperativeHandle } from "react";

const ChatBox = forwardRef((props, ref) => {
  const { actualRecipientId, userData, onSendMessage } = props;
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");

  const messageContainerRef = useRef(null);

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    addMessageToList,
  }));

  useEffect(() => {
    if (actualRecipientId !== "") loadMessages();
    else setMessageList([]);
  }, [actualRecipientId]);

  useEffect(() => {
    scrollDown();
  }, [messageList]);

  const loadMessages = async () => {
    let response = await axios(
      `http://localhost:8088/messages/${userData.email}/${actualRecipientId}`
    );

    setMessageList(response.data);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleMessage = () => {
    let newMessage = onSendMessage(inputText);
    addMessageToList(newMessage);

    setInputText("");
  };

  const addMessageToList = (newMessage) => {
    if (newMessage) {
      setMessageList([...messageList, newMessage]);
    }
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
        {messageList.map((message) => {
          if (message.recipientId === actualRecipientId)
            return <Message type="sender" messageData={message} />;
          else return <Message type="receiver" messageData={message} />;
        })}
      </div>
      <div className={classes.inputContainer}>
        <input
          value={inputText}
          className={classes.input}
          onChange={(e) => handleInputChange(e)}
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
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    width: "100%",
    height: "85%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "none",
  },
  inputContainer: {
    width: "100%",
    height: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: `solid 1px ${colors.primary}`,
    gap: "1rem",
  },
  input: {
    width: "80%",
    borderRadius: 0,
    outline: "none",
    border: "none",
    borderBottom: `solid 1px ${colors.black}`,
  },
  sendButton: {
    borderRadius: "10px",
    backgroundColor: colors.primary,
    color: colors.white,
  },
});
