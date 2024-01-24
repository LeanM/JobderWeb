import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import { ClockLoader } from "react-spinners";

const ClientSearchLoader = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <ClockLoader color={colors.secondary} aria-label="Loading..." />
        <p className={classes.text}>Buscando trabajadores...</p>
      </div>
    </div>
  );
};

export default ClientSearchLoader;

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    zIndex: 10,
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "50%",
    height: "30rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "2rem",
  },
  image: {
    width: "10rem",
    height: "10rem",
    objectFit: "fill",
  },
  text: {
    width: "100%",
    fontWeight: "bold",
    color: colors.secondary,
    textAlign: "center",
  },
});
