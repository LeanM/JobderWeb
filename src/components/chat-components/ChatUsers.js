import { createUseStyles } from "react-jss";
import ChatUserItem from "./ChatUserItem";
import { colors } from "../../assets/colors";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useImperativeHandle } from "react";

const ChatUsers = forwardRef((props, ref) => {
  const { chatRoomUsers, actualRecipientId } = props;
  const [userItemsDisplay, setUserItemsDisplay] = useState([]);
  const userItemRef = useRef(null);
  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    moveChatroomUserToFrontOnMessage,
  }));

  const moveChatroomUserToFrontOnMessage = (userId) => {
    let chatroomUserToMove = null;
    let newChatRoomUsersList = [];

    const chatroomUsersArray = [...chatRoomUsers];

    chatroomUsersArray.every((chatroomUser) => {
      if (chatroomUser.user.id === userId) {
        chatroomUserToMove = chatroomUser;
        return true;
      } else {
        newChatRoomUsersList.push(chatroomUser);
        return true;
      }
    });

    if (chatroomUserToMove != null) {
      chatroomUserToMove.chatRoom.state = "UNSEEN";
      return [chatroomUserToMove, ...newChatRoomUsersList];
    } else return false;
  };

  useEffect(() => {
    //regenerateUserItems();
  }, [chatRoomUsers]);

  const regenerateUserItems = () => {
    let newUserItemsDisplay = [];
    chatRoomUsers.map((chatroomUser) => {
      newUserItemsDisplay.push(
        <ChatUserItem
          key={chatroomUser.interaction.id}
          ref={userItemRef}
          onSelect={(userId) => props.onSelect(userId)}
          onChange={() => props.onReset()}
          chatroomUserData={chatroomUser}
          actualRecipientId={actualRecipientId}
        />
      );
    });

    console.log(newUserItemsDisplay);

    setUserItemsDisplay(newUserItemsDisplay);
  };

  return (
    <div className={classes.chatUsersContainer}>
      {chatRoomUsers.map((chatroomUser) => {
        return (
          <ChatUserItem
            key={chatroomUser.interaction.id}
            onSelect={(userId) => props.onSelect(userId)}
            onChange={() => props.onReset()}
            chatroomUserData={chatroomUser}
            state={chatroomUser.chatRoom.state}
            actualRecipientId={actualRecipientId}
          />
        );
      })}
    </div>
  );
});

export default ChatUsers;

const useStyles = createUseStyles({
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
