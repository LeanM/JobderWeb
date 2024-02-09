import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import ChatBox from "./ChatBox";
import ChatUserItem from "./ChatUserItem";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

var stompClient = null;
var socket = null;
export default function ChatScreen() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [chatRoomUsers, setChatRoomUsers] = useState([]);
  const [actualRecipientId, setActualRecipientId] = useState("");
  const [logged, setLogged] = useState(true);
  const chatBoxRef = useRef(null);
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth?.accessToken) connect();
    else navigate("/login", { state: { from: "/chat" } });

    return () => {
      try {
        stompClient.disconnect();
      } catch (error) {}
    };
  }, []);

  const connect = () => {
    socket = new WebSocket("wss://localhost:8080/ws");
    socket.onopen = () => {
      onConnected();
    };
  };

  const onConnected = () => {
    getChatRoomUsers();

    try {
      socket.send({ asd: "asd" });
    } catch (error) {
      console.log("ERROR");
      console.log(error);
    }
  };

  const getChatRoomUsers = () => {
    auth?.role === "CLIENT"
      ? getLikedOrMatchedWorkers()
          .then((response) => {
            setChatRoomUsers(response.data);
          })
          .catch((error) => {
            if (error?.response?.status === 401)
              navigate("/login", { state: { from: "/chat" } });
          })
      : getLikedOrMatchedClients()
          .then((response) => {
            setChatRoomUsers(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
            if (error?.response?.status === 401)
              navigate("/login", { state: { from: "/chat" } });
          });
  };

  const getLikedOrMatchedWorkers = async () => {
    return axiosPrivate.post("matching/client/likedOrMatchedWorkers");
  };

  const getLikedOrMatchedClients = async () => {
    return axiosPrivate.post("matching/worker/likedOrMatchedClients");
  };

  const resetSelectedUserChat = () => {
    getChatRoomUsers();
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
        senderId: auth.userId,
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

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.chatUsersContainer}>
            {chatRoomUsers.map((chatroomUser) => {
              return (
                <ChatUserItem
                  key={chatroomUser.interaction.id}
                  onSelect={(userId) => setActualRecipientId(userId)}
                  onChange={() => resetSelectedUserChat()}
                  chatroomUserData={chatroomUser}
                  actualRecipientId={actualRecipientId}
                />
              );
            })}
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
