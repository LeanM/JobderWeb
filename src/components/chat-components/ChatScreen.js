import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import ChatBox from "./ChatBox";

var stompClient = null;
export default function ChatScreen() {
  const [userData, setUserData] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [actualRecipientId, setActualRecipientId] = useState("");
  const [logged, setLogged] = useState(false);
  const chatBoxRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    if (userData !== null) {
      connect();
    }
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8088/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    getChatUsers();

    stompClient.subscribe(
      `/user/${userData.email}/queue/messages`,
      onMessageReceived
    );
  };

  const getChatUsers = async () => {
    let response = await axios.get(
      "http://localhost:8088/chatusers/" + userData.email
    );

    setChatUsers(response.data);
  };

  const onMessageReceived = (payload) => {
    getChatUsers();

    const message = JSON.parse(payload.body);
    if (actualRecipientId === message.senderId) {
      chatBoxRef.current.addMessageToList(message);
    }
  };

  const sendMessage = (messageContent) => {
    if (stompClient) {
      var chatMessage = {
        senderId: userData.email,
        recipientId: actualRecipientId,
        content: messageContent,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

      return chatMessage;
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  return !logged ? (
    <div>
      <button
        onClick={() => {
          setLogged(true);
          setUserData({
            email: "ddd@ddd.com",
            name: "asd",
            status: "ONLINE",
          });
        }}
      >
        Log on ddd
      </button>
      <button
        onClick={() => {
          setLogged(true);
          setUserData({
            email: "asd@asd.com",
            name: "asd",
            status: "ONLINE",
          });
        }}
      >
        Log on asd
      </button>
    </div>
  ) : (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.chatUsersContainer}>
            {chatUsers.map((user) => {
              return (
                <div
                  onClick={() => setActualRecipientId(user.email)}
                  className={classes.chatUserItem}
                >
                  {user.email}
                </div>
              );
            })}
            <div
              onClick={() => setActualRecipientId("")}
              className={classes.chatUserItem}
            >
              Limpiar
            </div>
          </div>
          <ChatBox
            ref={chatBoxRef}
            onSendMessage={(messageContent) => sendMessage(messageContent)}
            actualRecipientId={actualRecipientId}
            userData={userData}
          />
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    paddingTop: "12rem",
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "90%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: "20px",
  },
  chatUsersContainer: {
    width: "30%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  chatUserItem: {
    width: "90%",
    height: "4rem",
    backgroundColor: colors.hover,
  },
});
