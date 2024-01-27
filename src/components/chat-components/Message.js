import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Message(props) {
  const { type, messageData } = props;
  const classes = useStyles();
  const [messageHour, setMessageHour] = useState("");

  useEffect(() => {
    obtainHour();
  }, []);

  const obtainHour = () => {
    const messageTimestamp = new Date(
      format(messageData.timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    );
    const hours = ("0" + messageTimestamp.getHours()).slice(-2);
    const minutes = ("0" + messageTimestamp.getMinutes()).slice(-2);

    setMessageHour(`${hours}:${minutes}`);
  };

  return (
    <div
      className={
        type === "sender" ? classes.senderContainer : classes.receiverContainer
      }
    >
      <div className={classes.bubbleContainer}>
        <div className={classes.contentContainer}>
          <span style={{ color: colors.black }}>{messageData.content}</span>
        </div>

        <div className={classes.hourContainer}>
          <span style={{ fontSize: "0.6rem" }}>{messageHour}</span>
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  senderContainer: {
    width: "90%",
    minHeight: "4rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    //backgroundColor: colors.primary,
    borderRadius: "10px",
  },
  receiverContainer: {
    width: "95%",
    minHeight: "4rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: colors.secondary,
    borderRadius: "10px",
  },
  bubbleContainer: {
    minWidth: "10rem",
    minHeight: "80%",
    borderRadius: "20px",
    backgroundColor: colors.white,
    boxShadow: `0 0 5px ${colors.black}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "90%",
    minHeight: "2rem",
  },
  hourContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "85%",
    height: "1rem",
  },
  text: {
    color: colors.white,
  },
});
