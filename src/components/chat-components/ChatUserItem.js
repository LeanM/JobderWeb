import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Avatar from "react-avatar";
import { Tooltip, Whisper } from "rsuite";
import UserInteractionModal from "./UserInteractionModalForWorkers";
import UserInteractionModalForWorkers from "./UserInteractionModalForWorkers";
import UserInteractionModalForClients from "./UserInteractionModalForClients";

export default function ChatUserItem(props) {
  const { actualRecipientId, chatroomUserData, onSelect, onAccept } = props;
  const { auth } = useAuth();
  const [style, setStyle] = useState({});
  const [data, setData] = useState(chatroomUserData);
  const [notificationShow, setNotificationShow] = useState(false);
  const [newChatShow, setNewChatShow] = useState(false);
  const classes = useStyles();
  const [openUserInteraction, setOpenUserInteraction] = useState(false);

  useEffect(() => {
    setData(chatroomUserData);
  }, [chatroomUserData]);

  useEffect(() => {
    if (
      data?.chatRoom?.state === "UNSEEN" &&
      actualRecipientId !== data?.user?.id
    ) {
      setNotificationShow(true);
      setNewChatShow(false);
    } else if (data?.chatRoom?.state === "NEW") {
      setNewChatShow(true);
    }
  }, [data]);

  const nonSelectedStyle = {
    borderBottom: `solid 1px ${colors.primary}`,
  };
  const selectedStyle = {
    borderBottom: `solid 1px ${colors.secondary}`,
    backgroundColor: colors.primary,
  };

  useEffect(() => {
    if (actualRecipientId === data?.user?.id) {
      setNotificationShow(false);
      setNewChatShow(false);
      setStyle(selectedStyle);
    } else setStyle(nonSelectedStyle);
  }, [actualRecipientId]);

  const handleSelectChatUser = () => {
    if (auth?.role === "WORKER" && data?.chatRoom?.state === "NEW") {
      //si es worker y el chatroom es nuevo mostrar modal para aceptar o rechazar
      setOpenUserInteraction(true);
    } else {
      //sino onSelect
      onSelect(data?.user?.id);
    }
  };

  const updateDataStatusOnAccept = () => {
    //En un futuro traer la data actualizada del backend cuando sale bien
    // y setearlo aca completo
    let newData = {
      user: data.user,
      interaction: {
        ...data.interaction,
        interactionType: "MATCH",
      },
      chatRoom: { ...data.chatRoom, state: "UNSEEN" },
    };
    onAccept(newData);
  };

  return (
    <>
      {auth?.role === "CLIENT" ? (
        <UserInteractionModalForClients
          open={openUserInteraction}
          data={data}
          onClose={() => setOpenUserInteraction(false)}
          onReject={() => {
            props.onReject(data?.user?.id);
            onSelect(0);
            setOpenUserInteraction(false);
          }}
        />
      ) : auth?.role === "WORKER" ? (
        <UserInteractionModalForWorkers
          open={openUserInteraction}
          data={data}
          onClose={() => setOpenUserInteraction(false)}
          onReject={() => {
            props.onReject(data?.user?.id);
            onSelect(0);
            setOpenUserInteraction(false);
          }}
          onAccept={() => {
            updateDataStatusOnAccept();
          }}
        />
      ) : (
        <></>
      )}

      <div
        onClick={() => handleSelectChatUser()}
        style={style}
        className={classes.chatUserItem}
      >
        {!data?.user?.picture ? (
          <Whisper
            trigger="hover"
            placement={"bottom"}
            speaker={
              <Tooltip
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "Poppins",
                  textAlign: "center",
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                  borderRadius: "5px",
                }}
              >
                Ver info detallada
              </Tooltip>
            }
          >
            <div
              className={classes.imageContainer}
              onClick={() => {
                setOpenUserInteraction(true);
              }}
            >
              <Avatar
                size="100%"
                name={data?.user?.name}
                maxInitials={2}
                round={true}
              />
            </div>
          </Whisper>
        ) : (
          <Whisper
            trigger="hover"
            placement={"bottom"}
            speaker={
              <Tooltip
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "Montserrat",
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                  textAlign: "center",
                  borderRadius: "5px",
                }}
              >
                Ver info detallada
              </Tooltip>
            }
          >
            <div
              className={classes.imageContainer}
              onClick={() => {
                setOpenUserInteraction(true);
              }}
            >
              <img className={classes.image} src={data?.user?.picture} />
            </div>
          </Whisper>
        )}

        <span
          className={classes.chatUserItemText}
          style={{
            width: "70%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            textAlign: "left",
          }}
        >
          {data?.user?.name}
        </span>
        {notificationShow ? (
          <div className={classes.chatUserItemNotification}></div>
        ) : (
          <></>
        )}
        {newChatShow ? (
          <div className={classes.chatUserItemNewNotification}>
            <span>Nuevo!</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  chatUserItem: {
    width: "90%",
    height: "4rem",
    position: "relative",
    paddingLeft: "0.5rem",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    display: "flex",
    justifyContent: "flex-start",
    gap: "1rem",
    alignItems: "center",
    //backgroundColor: colors.primary,
    cursor: "pointer",
    borderBottom: `solid 1px ${colors.transparent}`,
    transition: "border 0.3s, background 0.3s",

    "&:hover": {
      backgroundColor: colors.secondary,
    },
  },
  imageContainer: {
    width: "2.7rem",
    height: "2.7rem",
    borderRadius: "100%",
    outline: "solid 1px " + colors.textSecondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "outline 0.1s",

    "&:hover": {
      outline: "solid 3px " + colors.textSecondary,
    },
  },
  image: {
    width: "90%",
    height: "92%",
    borderRadius: "100%",
    objectFit: "cover",
  },
  chatUserItemText: {
    color: colors.white,
    fontWeight: "200",
    fontSize: "1rem",
  },
  chatUserItemNotification: {
    position: "absolute",
    right: "5%",
    borderRadius: "100%",
    width: "0.4rem",
    height: "0.4rem",
    backgroundColor: colors.notificationLight,
  },
  chatUserItemNewNotification: {
    position: "absolute",
    fontSize: "0.7rem",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: "5%",
    height: "1.5rem",
    fontWeight: "300",
    color: colors.notificationLight,
  },
});
