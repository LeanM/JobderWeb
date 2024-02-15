import { useContext, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import ChatBox from "./ChatBox";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MDBIcon } from "mdb-react-ui-kit";
import ChatUsers from "./ChatUsers";
import ChatIndexDBContext from "../../context/ChatIndexDBProvider";

var stompClient = null;
export default function ChatScreen() {
  const navigate = useNavigate();
  const {
    currentChat,
    handleSelectChat,
    handleAddMessagesToChat,
    existsUserChat,
  } = useContext(ChatIndexDBContext);
  const { auth } = useAuth();
  const [chatRoomUsers, setChatRoomUsers] = useState([]);
  const [actualRecipientId, setActualRecipientId] = useState("");

  const chatBoxRef = useRef(null);
  const chatUsersRef = useRef(null);
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
    let Sock = new SockJS(process.env.REACT_APP_SOCKET_HOST + "/ws", null, {
      transports: ["websocket"],
      secure: true,
    });
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    getChatRoomUsers();
    try {
      stompClient.subscribe(
        `/user/${auth.userId}/queue/messages`,
        onMessageReceived
      );
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

  useEffect(() => {
    chatRoomUsers.map((chatroomUser) => {
      if (
        chatroomUser.chatRoom.state === "UNSEEN" ||
        chatroomUser.chatRoom.state === "NEW"
      ) {
        //Fetchear mensajes no vistos y agregarlos
        getNotSeenMessages(chatroomUser.user.id);
      }
    });
  }, [chatRoomUsers]);

  const getNotSeenMessages = (recipientId) => {
    axiosPrivate
      .get(`/chat/messages/unseen/${recipientId}`)
      .then((response) => handleAddMessagesToChat(recipientId, response.data))
      .catch((error) => console.log(error));
  };

  const resetSelectedUserChat = () => {
    getChatRoomUsers();
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (chatBoxRef.current.verifyUpcomingMessage(message)) {
      chatBoxRef.current.addMessages([message]);
    } else {
      toast(() => (
        <span>
          <MDBIcon icon="info" /> Recibiste un mensaje!
        </span>
      ));
      let newUserOrder = chatUsersRef.current.moveChatroomUserToFrontOnMessage(
        message.senderId
      );
      if (newUserOrder) {
        setChatRoomUsers(newUserOrder);
      } else getChatRoomUsers();
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

      let newUserOrder =
        chatUsersRef.current.moveChatroomUserToFrontOnMessage(
          actualRecipientId
        );
      if (newUserOrder) {
        setChatRoomUsers(newUserOrder);
        handleAddMessagesToChat(actualRecipientId, chatMessage);
        return chatMessage;
      }
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onSelectUserChat = (userId) => {
    setActualRecipientId(userId);
  };

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <ChatUsers
            ref={chatUsersRef}
            onSelect={(userId) => onSelectUserChat(userId)}
            onReset={() => resetSelectedUserChat()}
            actualRecipientId={actualRecipientId}
            chatRoomUsers={chatRoomUsers}
          />
          <ChatBox
            ref={chatBoxRef}
            onSendMessage={(messageContent) => sendMessage(messageContent)}
            actualRecipientId={actualRecipientId}
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
});
