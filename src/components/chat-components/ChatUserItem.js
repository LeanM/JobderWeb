import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import DesitionModal from "./DesitionModal";
import { on } from "rsuite/esm/DOMHelper";

export default function ChatUserItem(props) {
  const { actualRecipientId, chatroomUserData, onSelect } = props;
  const { auth } = useAuth();
  const [style, setStyle] = useState({});
  const [notificationShow, setNotificationShow] = useState(false);
  const [newChatShow, setNewChatShow] = useState(false);
  const classes = useStyles();
  const [openDesitionModal, setOpenDesitionModal] = useState(false);

  useEffect(() => {
    if (
      chatroomUserData.chatRoom.state === "UNSEEN" &&
      actualRecipientId !== chatroomUserData.user.id
    )
      setNotificationShow(true);
    else if (chatroomUserData.chatRoom.state === "NEW") {
      setNewChatShow(true);
    }
  }, [chatroomUserData]);

  const nonSelectedStyle = {
    borderBottom: `solid 1px ${colors.primary}`,
  };
  const selectedStyle = {
    borderBottom: `solid 1px ${colors.secondary}`,
    backgroundColor: colors.primary,
  };

  useEffect(() => {
    if (actualRecipientId === chatroomUserData.user.id) {
      setNotificationShow(false);
      setNewChatShow(false);
      setStyle(selectedStyle);
    } else setStyle(nonSelectedStyle);
  }, [actualRecipientId]);

  const handleSelectChatUser = () => {
    if (
      auth?.role === "WORKER" &&
      chatroomUserData?.chatRoom?.state === "NEW"
    ) {
      //si es worker y el chatroom es nuevo mostrar modal para aceptar o rechazar
      setOpenDesitionModal(true);
    } else {
      //sino onSelect
      onSelect(chatroomUserData.user.id);
    }
  };

  return (
    <>
      <DesitionModal
        clientData={chatroomUserData}
        open={openDesitionModal}
        onReject={() => {
          props.onChange();
          onSelect(0);
          setOpenDesitionModal(false);
        }}
        onAccept={() => {
          props.onChange();
          onSelect(chatroomUserData.user.id);
          setOpenDesitionModal(false);
        }}
        onClose={() => setOpenDesitionModal(false)}
      />
      <div
        onClick={() => handleSelectChatUser()}
        style={style}
        className={classes.chatUserItem}
      >
        <img className={classes.chatUserItemImage} src="./worker.jpg"></img>
        <span className={classes.chatUserItemText}>
          {chatroomUserData.user.name}
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
  chatUserItemImage: {
    width: "2.5rem",
    height: "2.5rem",
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
