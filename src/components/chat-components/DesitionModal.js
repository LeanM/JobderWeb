import { createUseStyles } from "react-jss";
import Modal from "@mui/material/Modal";
import { colors } from "../../assets/colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function DesitionModal(props) {
  const { open, clientData } = props;
  const axiosPrivate = useAxiosPrivate();
  const classes = useStyles();

  const handleAccept = () => {
    let acceptRequest = {
      clientId: clientData.user.id,
    };
    axiosPrivate
      .post("matching/worker/match", JSON.stringify(acceptRequest))
      .then((response) => {
        props.onAccept();
      })
      .catch((error) => {});
  };

  const handleReject = () => {
    let cancelRequest = {
      clientId: clientData.user.id,
    };
    axiosPrivate
      .post("matching/worker/reject", JSON.stringify(cancelRequest))
      .then((response) => {
        props.onReject();
      })
      .catch((error) => {});
  };

  return (
    <Modal open={open} onClose={props.onClose}>
      <div className={classes.container}>
        <button
          className={classes.upperCloseButton}
          onClick={() => props.onClose()}
        >
          X
        </button>
        <div className={classes.header}></div>
        <div className={classes.body}></div>
        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            <button
              className={classes.closeButton}
              onClick={() => handleAccept()}
            >
              Aceptar
            </button>

            <button
              className={classes.closeButton}
              onClick={() => props.onClose()}
            >
              Cerrar
            </button>
            <button
              className={classes.closeButton}
              onClick={() => handleReject()}
            >
              Rechazar
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
    width: "50%",
    height: "60%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: colors.primary,
    backgroundSize: "cover",
    border: `solid 1px ${colors.nav}`,
    borderRadius: "10px",
    fontFamily: "Poppins",

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
    height: "15rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerLine: {
    width: "1px",
    height: "3rem",
    backgroundColor: colors.nav,
    marginBottom: "1rem",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "700",
    color: colors.nav,
    lineHeight: "4.5rem",
  },
  subTitle: {
    fontSize: "1rem",
    fontWeight: "300",
    color: colors.nav,
  },
  body: {
    width: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "5rem",
    marginBottom: "5rem",
  },
  platesContainer: {
    width: "70%",
    position: "relative",
    borderRadius: "20px",
    border: `solid 2px ${colors.nav}`,
    //borderBottom: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    //paddingBottom: "2.5rem",
    paddingTop: "1rem",

    "@media screen and (max-width: 800px)": {
      width: "85%",
    },
  },
  platesContainerTitle: {
    position: "absolute",
    width: "30%",
    height: "2.5rem",
    backgroundColor: colors.nav,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.white,
    fontSize: "1.1rem",
    fontWeight: "200",
    borderRadius: "3px",
    top: "-1rem",
  },
  plateItem: {
    width: "95%",
    height: "4rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1.5rem",
  },
  plateInfoContainer: {
    display: "flex",
    width: "80%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
  },
  plateName: {
    color: colors.black,
    fontWeight: "300",
    fontSize: "0.9rem",
  },
  plateDescription: {
    color: colors.grey,
    fontWeight: "200",
    fontSize: "0.8rem",
  },
  platePrice: {
    color: colors.price,
    fontWeight: "300",
    fontSize: "0.9rem",
  },
  bottom: {
    width: "100%",
    backgroundColor: colors.nav,
  },
  bottomInner: {
    width: "100%",
    height: "7rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  upperCloseButton: {
    right: "10px",
    top: "10px",
    position: "absolute",
    fontWeight: "700",
    backgroundColor: colors.textNav,
    color: colors.nav,
    borderRadius: "100%",
    border: `solid 1px ${colors.navLight}`,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      backgroundColor: colors.nav,
      color: colors.white,
    },
  },
  closeButton: {
    width: "8rem",
    height: "3rem",
    border: `solid 1px ${colors.navLight}`,
    borderRadius: "20px",
    backgroundColor: colors.nav,
    color: colors.textNav,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      color: colors.nav,
      backgroundColor: colors.textNav,
    },
  },
});
