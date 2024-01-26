import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import Message from "./Message";
import axios from "axios";
import { colors } from "../../assets/colors";

export default function ChatBox(props) {
  const { actualRecipientId, userData, onSendMessage } = props;
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (actualRecipientId !== "") loadMessages();
    else setMessageList([]);
  }, [actualRecipientId]);

  const loadMessages = async () => {
    let response = await axios(
      `http://localhost:8088/messages/${userData.email}/${actualRecipientId}`
    );
    console.log(response);

    setMessageList(response.data);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleMessage = () => {
    let newMessage = onSendMessage(inputText);
    if (newMessage) {
      setMessageList([...messageList, newMessage]);
    }

    setInputText("");
  };

  return (
    <div className={classes.container}>
      <div className={classes.messagesContainer}>
        {messageList.map((message) => {
          console.log(message);
          console.log(actualRecipientId);
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
}

const useStyles = createUseStyles({
  container: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  messagesContainer: {
    width: "100%",
    height: "90%",
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
    backgroundColor: "blue",
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
