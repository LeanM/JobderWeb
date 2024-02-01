import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import ChatBox from "./ChatBox";
import ChatUserItem from "./ChatUserItem";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  getLikedOrMatchedWorkers,
  getProfile,
} from "../../connection/requests";
import useAuth from "../../hooks/useAuth";

var stompClient = null;
export default function ChatScreen() {
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [chatRoomUsers, setChatRoomUsers] = useState([]);
  const [actualRecipientId, setActualRecipientId] = useState("");
  const [logged, setLogged] = useState(true);
  const chatBoxRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData !== null) {
      console.log(userData);
      connect();
    }
  }, [userData]);

  const getUserData = () => {
    getProfile(auth?.accessToken)
      .then((response) => setUserData(response.data))
      .catch((err) => console.log(err));
  };

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    getChatRoomUsers();

    stompClient.subscribe(
      `/user/${userData.id}/queue/messages`,
      onMessageReceived
    );
  };

  const getChatRoomUsers = () => {
    getLikedOrMatchedWorkers(auth.accessToken)
      .then((response) => {
        setChatRoomUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (actualRecipientId === message.senderId) {
      chatBoxRef.current.addMessageToList(message);
    } else {
      toast.success("Recibiste un mensaje!");
      getChatRoomUsers();
    }
  };

  const calculateTime = (messageData) => {
    const actualDate = new Date();
    const actualTimestamp = new Date(
      format(actualDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    );
    const messageTimestamp = new Date(
      format(messageData.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    );
    const tiempoPasado = actualTimestamp - messageTimestamp;

    const horasTranscurridas = (tiempoPasado / (1000 * 60 * 60)).toFixed(2);

    if (horasTranscurridas < 1) {
      return toString(horasTranscurridas * 60) + "mins";
    }
    console.log(horasTranscurridas);
  };

  const sendMessage = (messageContent) => {
    if (stompClient) {
      const actualDate = new Date();
      const timestamp = format(actualDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
      var chatMessage = {
        senderId: userData.id,
        recipientId: actualRecipientId,
        content: messageContent,
        timestamp: timestamp,
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
            {chatRoomUsers.map((chatroomUser) => {
              return (
                <ChatUserItem
                  onSelect={(userId) => setActualRecipientId(userId)}
                  chatroomUserData={chatroomUser}
                  actualRecipientId={actualRecipientId}
                />
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
    fontFamily: "Montserrat",
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
    borderRight: `solid 1px ${colors.primary}`,
    gap: "1rem",
    paddingTop: "2rem",
  },
});
