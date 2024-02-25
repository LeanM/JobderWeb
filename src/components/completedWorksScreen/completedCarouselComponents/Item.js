import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import Avatar from "react-avatar";

export default function Item(props) {
  const { userInteractionData, onSelect } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      onClick={() => onSelect(userInteractionData)}
    >
      {!userInteractionData?.user?.picture ? (
        <div className={classes.imageContainer}>
          <Avatar
            size="100%"
            name={userInteractionData?.user?.name}
            maxInitials={2}
            round={true}
          />
        </div>
      ) : (
        <div className={classes.imageContainer}>
          <img
            className={classes.userImage}
            src={userInteractionData?.user?.picture}
          ></img>
        </div>
      )}

      <div className={classes.infoContainer}>
        <span className={classes.text} style={{ fontWeight: "600" }}>
          {userInteractionData?.user.name}
        </span>
        <span
          className={classes.text}
          style={{ fontWeight: "200", fontSize: "0.8rem" }}
        >
          {userInteractionData?.user.workSpecialization}
        </span>
        <span
          className={classes.text}
          style={{ fontWeight: "200", fontSize: "0.8rem" }}
        >
          "{userInteractionData?.interaction?.clientProblemDescription}"
        </span>
      </div>
    </div>
  );
}

const useStyles = createUseStyles((theme) => ({
  container: {
    width: "15rem",
    height: "6rem",
    position: "relative",
    textAlign: "center",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    border: "solid 1px " + colors.secondary,
    color: colors.textSecondary,
    borderRadius: "20px",
    textDecoration: "none !important",
    cursor: "pointer",

    transition: "background 0.3s ease-in-out, color 0.3s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },

    "@media screen and (max-width: 1300px)": {
      width: "10rem",
    },

    "@media screen and (max-width: 800px)": {
      width: "7rem",
    },
  },
  imageContainer: {
    width: "3rem",
    height: "3rem",
    left: "10px",
    position: "absolute",
    borderRadius: "100%",
    border: "solid 2px " + colors.secondary,
  },
  userImage: {
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    objectFit: "cover",
  },
  infoContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
}));
