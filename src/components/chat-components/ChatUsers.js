import { createUseStyles } from "react-jss";
import ChatUserItem from "./ChatUserItem";
import { colors } from "../../assets/colors";
import { forwardRef, useContext, useEffect } from "react";
import { useImperativeHandle } from "react";
import ChatIndexDBContext from "../../context/ChatIndexDBProvider";

const ChatUsers = forwardRef((props, ref) => {
  const { chatRoomUsers, actualRecipientId } = props;
  const { obtainAllChatUserAndState } = useContext(ChatIndexDBContext);
  const [chatRoomUsersData, setChatRoomUsersData] = useEffect([]);

  const classes = useStyles();

  useEffect(() => {
    obtainAllChatUserAndState().then((response) => console.log(response));
  }, [chatRoomUsers]);

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
      return [chatroomUserToMove, ...newChatRoomUsersList];
    } else return false;
  };

  return (
    <div className={classes.chatUsersContainer}>
      <div className={classes.chatUsersSubContainer}>
        {chatRoomUsers.map((chatroomUser) => {
          return (
            <ChatUserItem
              key={chatroomUser.interaction.id}
              onSelect={(userId) => props.onSelect(userId)}
              onChange={() => props.onReset()}
              chatroomUserData={chatroomUser}
              actualRecipientId={actualRecipientId}
            />
          );
        })}
      </div>
    </div>
  );
});

export default ChatUsers;

const useStyles = createUseStyles({
  chatUsersContainer: {
    width: "25%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatUsersSubContainer: {
    width: "100%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRight: "solid 1px " + colors.secondary,
    gap: "1rem",
    paddingTop: "2rem",
  },
});
