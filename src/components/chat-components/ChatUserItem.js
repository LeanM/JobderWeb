import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";

export default function ChatUserItem(props) {
  const { actualRecipientId, chatroomUserData, onSelect } = props;
  const [style, setStyle] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (chatroomUserData.chatRoomState === "unseen") setStyle(notifiedStyle);
  }, [chatroomUserData]);

  const nonSelectedStyle = {
    borderBottom: `solid 1px ${colors.primary}`,
  };

  const notifiedStyle = {
    border: `solid 1px ${colors.notification}`,
  };

  const selectedStyle = {
    borderBottom: `solid 1px ${colors.white}`,
    backgroundColor: colors.primary,
  };

  useEffect(() => {
    if (actualRecipientId === chatroomUserData.user.email)
      setStyle(selectedStyle);
    else setStyle(nonSelectedStyle);
  }, [actualRecipientId]);

  return (
    <div
      onClick={() => onSelect(chatroomUserData.user.email)}
      style={style}
      className={classes.chatUserItem}
    >
      <img className={classes.chatUserItemImage} src="./worker.jpg"></img>
      <span className={classes.chatUserItemText}>
        {chatroomUserData.user.name + chatroomUserData.chatRoomState}
      </span>
    </div>
  );
}

const useStyles = createUseStyles({
  chatUserItem: {
    width: "90%",
    height: "4rem",
    paddingLeft: "0.5rem",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    display: "flex",
    justifyContent: "flex-start",
    gap: "1rem",
    alignItems: "center",
    //backgroundColor: colors.primary,
    cursor: "pointer",
    borderBottom: `solid 1px ${colors.primary}`,
    transition: "border 0.3s, background 0.3s",

    "&:hover": {
      backgroundColor: colors.primary,
    },
  },
  chatUserItemImage: {
    width: "3rem",
    height: "3rem",
    borderRadius: "100%",
    objectFit: "cover",
  },
  chatUserItemText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: "1.1rem",
  },
});
