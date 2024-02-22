import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

export default function UserInteractionModalForWorkers(props) {
  const { open, data, onClose, onReject, onAccept } = props;
  const classes = useStyles();
  const [actualData, setActualData] = useState({});
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setActualData(data);
  }, [data]);

  const handleAccept = () => {
    let acceptRequest = {
      clientId: actualData?.user?.id,
    };
    toast.promise(
      axiosPrivate.post("matching/worker/match", JSON.stringify(acceptRequest)),
      {
        loading: "Matcheando con el cliente...",
        success: (response) => {
          onAccept();
          return <b>Se matcheo con el cliente!</b>;
        },
        error: (error) => {
          return (
            <span>
              Ocurrio el siguiente error al matchear con el cliente :{" "}
              {error?.response?.data}
            </span>
          );
        },
      }
    );
  };

  const handleReject = () => {
    let cancelRequest = {
      clientId: actualData?.user?.id,
    };
    toast.promise(
      axiosPrivate.post(
        "matching/worker/reject",
        JSON.stringify(cancelRequest)
      ),
      {
        loading: "Rechazando cliente...",
        success: (response) => {
          onReject();
          return <b>Se rechazo al cliente!</b>;
        },
        error: (error) => {
          return (
            <span>
              Ocurrio el siguiente error al rechazar al cliente :{" "}
              {error?.response?.data}
            </span>
          );
        },
      }
    );
  };

  const handleCancelMatch = () => {
    let cancelRequest = {
      clientId: actualData?.user?.id,
    };
    toast.promise(
      axiosPrivate.post(
        "matching/worker/cancelMatch",
        JSON.stringify(cancelRequest)
      ),
      {
        loading: "Cancelando match...",
        success: (response) => {
          onReject();
          return <b>Se cancelo el match con el cliente!</b>;
        },
        error: (error) => {
          return (
            <span>
              Ocurrio el siguiente error al cancelar el match con el cliente :{" "}
              {error?.response?.data}
            </span>
          );
        },
      }
    );
  };

  return (
    <Modal open={open}>
      <div className={classes.container}>
        <button
          className={classes.upperCloseButton}
          onClick={() => props.onClose()}
        >
          X
        </button>
        <div className={classes.header}>
          <div className={classes.headerLine}></div>
          <span className={classes.title}>INFORMACION</span>
          <span className={classes.subTitle}>Interaccion</span>
        </div>
        <div className={classes.body}>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Nombre de cliente</span>
            <span className={classes.itemInfo}>{actualData?.user?.name}</span>
          </div>

          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Telefono</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.phoneNumber}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Direccion del cliente</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.address}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Problema</span>
            <span className={classes.itemInfo}>
              {actualData?.interaction?.clientProblemDescription}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Urgencia</span>
            <span className={classes.itemInfo}>
              {actualData?.interaction?.clientUrgency === "MODERATED"
                ? "Moderado"
                : "Urgente"}
            </span>
          </div>
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            {actualData?.interaction?.interactionType === "CLIENT_LIKE" ? (
              <button
                className={classes.acceptButton}
                onClick={() => handleAccept()}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: colors.price,
                  }}
                >
                  Aceptar
                </span>
                <MDBIcon style={{ color: colors.price }} icon="check" />
              </button>
            ) : (
              <></>
            )}

            <button className={classes.closeButton} onClick={() => onClose()}>
              Cerrar
            </button>
            {actualData?.interaction?.interactionType === "CLIENT_LIKE" ? (
              <button
                className={classes.rejectButton}
                onClick={() => handleReject()}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: colors.notificationLight,
                  }}
                >
                  Rechazar
                </span>
                <MDBIcon
                  style={{ color: colors.notificationLight }}
                  icon="times-circle"
                />
              </button>
            ) : actualData?.interaction?.interactionType === "MATCH" ? (
              <button
                className={classes.cancelMatchButton}
                onClick={() => handleCancelMatch()}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    color: colors.notificationLight,
                  }}
                >
                  Cancelar Match
                </span>
                <MDBIcon
                  icon="ban"
                  style={{ color: colors.notificationLight }}
                />
              </button>
            ) : (
              <></>
            )}
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
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    fontSize: "3rem",
    fontWeight: "700",
    color: colors.primary,
    lineHeight: "4.5rem",
  },
  subTitle: {
    fontSize: "1rem",
    fontWeight: "300",
    color: colors.primary,
  },
  body: {
    width: "100%",
    height: "65%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: "10%",
    alignItems: "center",
    gap: "1rem",
  },
  bodyInfoItem: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
  itemTitle: {
    fontWeight: "700",
    fontSize: "1.1rem",
    color: colors.primary,
  },
  itemInfo: {
    fontWeight: "300",
    fontSize: "1rem",
    color: colors.primary,
  },
  bottom: {
    width: "100%",
    height: "15%",
    backgroundColor: colors.primary,
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  bottomInner: {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    justifyContent: "space-evenly",
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
  acceptButton: {
    width: "5rem",
    height: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: `solid 1px ${colors.transparent}`,
    borderRadius: "100px",
    backgroundColor: colors.primary,

    transition: "border 0.2s",

    "&:hover": {
      border: `solid 1px ${colors.price}`,
    },
  },
  rejectButton: {
    width: "5rem",
    height: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: `solid 1px ${colors.transparent}`,
    borderRadius: "100px",
    backgroundColor: colors.primary,

    transition: "border 0.2s",

    "&:hover": {
      border: `solid 1px ${colors.notificationLight}`,
    },
  },
  cancelMatchButton: {
    width: "7rem",
    height: "3rem",
    position: "absolute",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: `solid 1px ${colors.transparent}`,
    borderRadius: "100px",
    backgroundColor: colors.primary,

    transition: "border 0.2s",

    "&:hover": {
      border: `solid 1px ${colors.notificationLight}`,
    },
  },
});
