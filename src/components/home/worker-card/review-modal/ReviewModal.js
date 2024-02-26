import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../../../assets/colors";
import { createUseStyles } from "react-jss";
import ReviewItem from "./ReviewItem";

export default function ReviewModal(props) {
  const { open, onClose, reviews } = props;

  const classes = useStyles();

  return (
    <Modal open={open} onClose={() => onClose()}>
      <div className={classes.container}>
        <button className={classes.upperCloseButton} onClick={() => onClose()}>
          X
        </button>
        <div className={classes.header}>
          <div className={classes.headerLine}></div>
          <span className={classes.title}>Opiniones</span>
          <span className={classes.subTitle}>Del trabajador</span>
        </div>

        <div className={classes.body}>
          {reviews.map((review) => {
            return <ReviewItem reviewData={review} />;
          })}
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            <button className={classes.closeButton} onClick={() => onClose()}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    width: "40%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: colors.textSecondary,
    backgroundSize: "cover",
    border: `solid 1px ${colors.primary}`,
    borderRadius: "5px",
    boxShadow: "0 0 5px black",
    fontFamily: "Montserrat",

    "@media screen and (max-width: 800px)": {
      width: "95%",
    },
  },
  background: {
    position: "absolute",
    backgroundSize: "cover",

    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 0.2,
  },
  header: {
    width: "100%",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "2rem",
  },
  headerLine: {
    width: "1px",
    height: "3rem",
    backgroundColor: colors.primary,
    marginBottom: "1rem",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "700",
    color: colors.primary,
    lineHeight: "4.5rem",
  },
  subTitle: {
    fontSize: "1rem",
    fontWeight: "300",
    color: colors.primary,
  },
  stepsContainer: {
    display: "flex",
    width: "80%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    color: colors.primaryDark,
    gap: "0.3rem",
    marginBottom: "2rem",
  },
  body: {
    width: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
    overflowY: "scroll",
    paddingTop: "2rem",
    paddingBottom: "2rem",
    gap: "1rem",
  },
  bottom: {
    width: "100%",
    height: "10rem",
    backgroundColor: colors.primary,
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  bottomInner: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  upperCloseButton: {
    right: "10px",
    top: "10px",
    position: "absolute",
    fontWeight: "700",
    backgroundColor: colors.textSecondary,
    color: colors.primary,
    borderRadius: "100%",
    border: `solid 1px ${colors.secondary}`,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      backgroundColor: colors.primary,
      color: colors.white,
    },
  },
  closeButton: {
    width: "8rem",
    height: "3rem",
    border: `solid 1px ${colors.secondary}`,
    borderRadius: "20px",
    backgroundColor: colors.primary,
    color: colors.textSecondary,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      color: colors.primary,
      backgroundColor: colors.textSecondary,
    },
  },
});
