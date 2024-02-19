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
    handleUpdateChat,
    handleMessageSent,
    handleMessageReceived,
    verifyMessageQuantity,
    handleRefreshChat,
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
            verifyNotSeenMessages(response.data);
          })
          .catch((error) => {
            if (error?.response?.status === 401)
              navigate("/login", { state: { from: "/chat" } });
          })
      : getLikedOrMatchedClients()
          .then((response) => {
            setChatRoomUsers(response.data);
            verifyNotSeenMessages(response.data);
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

  const setSeenChatRoom = (userId) => {
    let body = {
      recipientId: userId,
    };
    axiosPrivate.post("/chatroom/updateSeenChatroom", JSON.stringify(body));
  };

  const verifyNotSeenMessages = async (ChatRooms) => {
    ChatRooms.map((chatroomUser) => {
      if (
        chatroomUser.chatRoom.state === "UNSEEN" ||
        chatroomUser.chatRoom.state === "NEW"
      ) {
        //Fetchear mensajes no vistos y agregarlos
        getNotSeenMessages(chatroomUser?.user?.id)
          .then((response) => {
            handleUpdateChat(chatroomUser, response.data).then((completed) => {
              if (!completed) {
                //Los mensajes estan inconsistentes
                //Pedir todos los mensajes del chat y setearlos con el handle refresh
                getMessages(chatroomUser?.user?.id)
                  .then((response) =>
                    handleRefreshChat(chatroomUser, response.data)
                  )
                  .catch((error) => console.log(error));
              }
            });
          })
          .catch((error) => console.log(error));
      } else {
        verifyMessageQuantity(
          chatroomUser?.user?.id,
          chatroomUser?.chatRoom?.messageQuantity
        ).then((correctMessageQuantity) => {
          if (!correctMessageQuantity)
            getMessages(chatroomUser?.user?.id)
              .then((response) =>
                handleRefreshChat(chatroomUser, response.data)
              )
              .catch((error) => console.log(error));
        });
      }
    });
  };

  const getMessages = async (chatUserId) => {
    return axiosPrivate.get(`/chat/messages/${chatUserId}`);
  };

  const getNotSeenMessages = async (recipientId) => {
    return axiosPrivate.get(`/chat/messages/unseen/${recipientId}`);
  };

  const resetSelectedUserChat = () => {
    getChatRoomUsers();
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (chatBoxRef.current.verifyUpcomingMessage(message)) {
      handleMessageReceived(message.senderId, true, message);
      chatBoxRef.current.addMessages(false, [message]);
      setSeenChatRoom(message.senderId);
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
        handleMessageReceived(message.senderId, false, message);
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

      handleMessageSent(actualRecipientId, chatMessage);

      if (newUserOrder) {
        setChatRoomUsers(newUserOrder);
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
    height: "80vh",
    paddingTop: "12rem",
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    fontFamily: "Montserrat",
  },
  subContainer: {
    width: "90%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    //border: "solid 1px " + colors.secondary,
    borderRadius: "10px",
  },
});
