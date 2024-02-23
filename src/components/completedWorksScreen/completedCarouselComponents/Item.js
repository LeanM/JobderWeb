import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";

export default function Item(props) {
  const { userInteractionData, onSelect } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      onClick={() => onSelect(userInteractionData)}
    >
      <div className={classes.infoContainer}>
        <p className={classes.text} style={{ fontWeight: "600" }}>
          {userInteractionData?.user.name}
        </p>
        <p
          className={classes.text}
          style={{ fontWeight: "200", fontSize: "0.8rem" }}
        >
          {userInteractionData?.user.workSpecialization}
        </p>
      </div>
      <p
        className={classes.text}
        style={{ fontWeight: "200", fontSize: "0.8rem" }}
      >
        "{userInteractionData?.interaction?.clientProblemDescription}"
      </p>
    </div>
  );
}

const useStyles = createUseStyles((theme) => ({
  container: {
    width: "12rem",
    height: "90%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "solid 1px " + colors.secondary,
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    textDecoration: "none !important",
    cursor: "pointer",
    gap: "0.5rem",

    transition: "background 0.3s ease-in-out, color 0.3s",

    "&:hover": {
      backgroundColor: colors.navSemiTransparent,
      color: "black",
    },

    "@media screen and (max-width: 1300px)": {
      width: "10rem",
    },

    "@media screen and (max-width: 800px)": {
      width: "7rem",
    },
  },
  infoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: colors.textSecondary,
  },
}));
