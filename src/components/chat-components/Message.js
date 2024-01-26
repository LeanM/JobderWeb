import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";

export default function Message(props) {
  const { type, messageData } = props;
  const classes = useStyles();

  return (
    <div
      className={
        type === "sender" ? classes.senderContainer : classes.receiverContainer
      }
    >
      <div className={classes.bubbleContainer}>
        <span style={{ color: colors.black }}>{messageData.content}</span>
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
    minWidth: "5rem",
    minHeight: "80%",
    borderRadius: "20px",
    backgroundColor: colors.white,
    boxShadow: `0 0 5px ${colors.black}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
  },
});
