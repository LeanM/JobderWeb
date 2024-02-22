import { createUseStyles } from "react-jss";
import ChatUserItem from "./ChatUserItem";
import { colors } from "../../../../assets/colors";
import { forwardRef, useEffect, useState } from "react";
import { useImperativeHandle } from "react";
import TabSelection from "../TabSelection";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import MatchCompletedItem from "./MatchCompletedItem";
import UserInteractionModalForClients from "./UserInteractionModalForClients";

const ChatUsers = forwardRef((props, ref) => {
  const { chatRoomUsers, actualRecipientId } = props;
  const axiosPrivate = useAxiosPrivate();
  const [matchesCompletedUsers, setMatchesCompletedUsers] = useState([]);
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Matches", itemCode: "MATCHES" },
    { id: 2, itemName: "Matches Completados", itemCode: "COMPLETED" },
  ]);
  const [actualTabSelection, setActualTabSelection] = useState("MATCHES");

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    moveChatroomUserToFrontOnMessage,
  }));

  useEffect(() => {
    fetchMatchesCompletedUsers();
  }, []);

  const fetchMatchesCompletedUsers = () => {
    axiosPrivate
      .post("/matching/client/matchesCompletedWorkers")
      .then((response) => setMatchesCompletedUsers(response.data))
      .catch((error) => console.log(error));
  };

  const handleChangeTabSelection = (selection) => {
    setActualTabSelection(selection);
  };

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
      <div className={classes.matchesSelectionContainer}>
        <TabSelection
          selectionItemsArray={selectionItemsArray}
          onSelect={(selection) => {
            handleChangeTabSelection(selection);
          }}
        />
      </div>
      <div className={classes.chatUsersSubContainer}>
        {actualTabSelection === "COMPLETED"
          ? matchesCompletedUsers.map((matchCompletedUser) => {
              return (
                <MatchCompletedItem matchCompletedData={matchCompletedUser} />
              );
            })
          : chatRoomUsers.map((chatroomUser) => {
              return (
                <ChatUserItem
                  key={chatroomUser.interaction.id}
                  onSelect={(userId) => props.onSelect(userId)}
                  onReject={(userId) => {
                    props.onDelete(userId);
                  }}
                  onAccept={(userChatRoom) => props.onUpdate(userChatRoom)}
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
    flexDirection: "column",
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
  matchesSelectionContainer: {
    width: "100%",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
