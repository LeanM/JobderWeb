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
import { EventSourcePolyfill } from "event-source-polyfill";
import { MDBIcon } from "mdb-react-ui-kit";
import useRefreshToken from "../../hooks/useRefreshToken";

export default function ChatScreen() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const [userData, setUserData] = useState(null);
  const [chatRoomUsers, setChatRoomUsers] = useState([]);
  const [actualRecipientId, setActualRecipientId] = useState("");
  const [logged, setLogged] = useState(true);
  const chatBoxRef = useRef(null);
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth?.accessToken) {
      let url = process.env.REACT_APP_SERVER_HOST + "/chat/suscribe";
      const sse = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });

      sse.addEventListener("user-list-event", (event) => {
        const data = JSON.parse(event.data);
        onMessagesReceived(data);
      });

      sse.onopen = () => {
        onConnected();
      };

      sse.onerror = () => {
        sse.close();
      };

      return () => {
        sse.close();
      };
    } else navigate("/login", { state: { from: "/chat" } });
  }, []);

  const onConnected = () => {
    getChatRoomUsers();
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

  const onMessagesReceived = (payload) => {
    let messageNotInChatBox = false;
    if (payload.length > 0) {
      for (let i = 0; i < payload.length; i++) {
        if (chatBoxRef.current.verifyUpcomingMessage(payload[i].message)) {
          chatBoxRef.current.addMessageToList(payload[i].message);
        } else messageNotInChatBox = true;
      }
      if (messageNotInChatBox) {
        toast(() => (
          <span>
            <MDBIcon icon="info" /> Recibiste mensajes!
          </span>
        ));

        getChatRoomUsers();
      }
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
    const actualDate = new Date();
    const timestamp = format(actualDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    var chatMessage = {
      senderId: auth.userId,
      recipientId: actualRecipientId,
      content: messageContent,
      timestamp: timestamp,
    };

    axiosPrivate
      .post("/chat/send", JSON.stringify(chatMessage))
      .then((response) => {})
      .catch((error) => toast.error("Error sending message!"));

    return chatMessage;
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
