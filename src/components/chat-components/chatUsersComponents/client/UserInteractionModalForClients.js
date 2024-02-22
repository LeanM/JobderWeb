import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import Avatar from "react-avatar";

export default function UserInteractionModalForClients(props) {
  const { open, data, onClose, onReject } = props;
  const classes = useStyles();
  const [actualData, setActualData] = useState({});
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setActualData(data);
  }, [data]);

  const handleCancelMatch = () => {
    let cancelRequest = {
      workerId: actualData?.user?.id,
    };
    toast.promise(
      axiosPrivate.post(
        "matching/client/cancelMatch",
        JSON.stringify(cancelRequest)
      ),
      {
        loading: "Cancelando match...",
        success: (response) => {
          onReject();
          return <b>Se cancelo el match con el trabajador!</b>;
        },
        error: (error) => {
          return (
            <span>
              Ocurrio el siguiente error al cancelar el match con el trabajador
              : {error?.response?.data}
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
          <span className={classes.subTitle}>Trabajador</span>
        </div>

        <div className={classes.body}>
          <div className={classes.bodyTitle}>
            {!actualData?.user?.picture ? (
              <div className={classes.userImageContainer}>
                <Avatar
                  size="100%"
                  name={actualData?.user?.name}
                  maxInitials={2}
                  round={true}
                />
              </div>
            ) : (
              <div className={classes.userImageContainer}>
                <img
                  className={classes.userImage}
                  src={actualData?.user?.picture}
                ></img>
              </div>
            )}
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: colors.primary,
              }}
            >
              {actualData?.user?.name}
            </span>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "200",
                color: colors.primary,
              }}
            >
              {actualData?.user?.workSpecialization}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "400",
                color: colors.primary,
              }}
            >
              <MDBIcon icon="star" />
              {actualData?.user?.averageRating}{" "}
              {` (${actualData?.user?.totalReviews})`}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Descripcion</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.description}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Horario Laboral</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.workingHours}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Trabajos realizados</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.worksFinished}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Telefono</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.phoneNumber}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Direccion del trabajador</span>
            <span className={classes.itemInfo}>
              {actualData?.user?.address}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>Tu Problema</span>
            <span className={classes.itemInfo}>
              {actualData?.interaction?.clientProblemDescription}
            </span>
          </div>
          <div className={classes.bodyInfoItem}>
            <span className={classes.itemTitle}>
              Disponibilidad del trabajador
            </span>
            <span className={classes.itemInfo}>
              {actualData?.user?.availabilityStatus === "MODERATED"
                ? "Moderada"
                : actualData?.user?.availabilityStatus === "AVAILABLE"
                ? "Hoy disponible"
                : "Hoy no disponible"}
            </span>
          </div>
        </div>

        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            <button className={classes.closeButton} onClick={() => onClose()}>
              Cerrar
            </button>
            {actualData?.interaction?.interactionType === "MATCH" ? (
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
    justifyContent: "flex-start",
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
    width: "95%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
    overflowY: "scroll",
    marginBottom: "2rem",
  },
  bodyTitle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  userImageContainer: {
    width: "7rem",
    height: "7rem",
    borderRadius: "100%",
    border: "solid 2px " + colors.secondary,
  },
  userImage: {
    borderRadius: "100%",
    objectFit: "cover",
    width: "100%",
    height: "100%",
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
  cancelMatchButton: {
    width: "7rem",
    height: "3rem",
    position: "absolute",
    right: "2rem",
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
