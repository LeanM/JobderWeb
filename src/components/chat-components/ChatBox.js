import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import Message from "./Message";
import { colors } from "../../assets/colors";
import React, { forwardRef, useImperativeHandle } from "react";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const ChatBox = forwardRef((props, ref) => {
  const { auth } = useAuth();
  const { actualRecipientId, userData, onSendMessage } = props;
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [actualDate, setActualDate] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [messageDisplay, setMessageDisplay] = useState([]);

  const messageContainerRef = useRef(null);

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    addMessageToList,
    verifyUpcomingMessage,
  }));

  useEffect(() => {
    if (actualRecipientId !== "") loadMessages();
    else setMessageList([]);
  }, [actualRecipientId]);

  useEffect(() => {
    fillMessageDisplay();
  }, [messageList]);

  useEffect(() => {
    scrollDown();
  }, [messageDisplay]);

  const loadMessages = () => {
    getMessages()
      .then((response) => setMessageList(response.data))
      .catch((error) => {
        if (error?.response?.status === 401)
          navigate("/login", { state: { from: "/chat" } });
      });
  };

  const getMessages = async () => {
    return axiosPrivate.get(`/chat/messages/${actualRecipientId}`);
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
      let newMessageDisplay =
        newMessage.recipientId === actualRecipientId ? (
          <Message type="sender" messageData={newMessage} />
        ) : (
          <Message type="receiver" messageData={newMessage} />
        );

      setMessageDisplay([...messageDisplay, newMessageDisplay]);
    }
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

  const fillMessageDisplay = () => {
    let display = [];
    let previousDate = "";
    messageList.map((message) => {
      const messageTimestamp = new Date(
        format(message.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
      );
      const year = messageTimestamp.getFullYear();
      const month = ("0" + (messageTimestamp.getMonth() + 1)).slice(-2); // Suma 1 ya que los meses van de 0 a 11
      const day = ("0" + messageTimestamp.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      if (formattedDate !== previousDate) {
        previousDate = formattedDate;
        display.push(
          <div className={classes.timeContainer}>
            <span style={{ color: colors.white }}>{formattedDate}</span>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: colors.primary,
              }}
            ></div>
          </div>
        );
        if (message.recipientId === actualRecipientId) {
          display.push(<Message type="sender" messageData={message} />);
        } else {
          display.push(<Message type="receiver" messageData={message} />);
        }
      } else {
        if (message.recipientId === actualRecipientId) {
          display.push(<Message type="sender" messageData={message} />);
        } else {
          display.push(<Message type="receiver" messageData={message} />);
        }
      }
    });

    setMessageDisplay(display);
    scrollDown();
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
  timeContainer: {
    width: "65%",
    height: "3rem",
    display: "flex",
    marginBottom: "1rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
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
