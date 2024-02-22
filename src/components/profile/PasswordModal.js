import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

export default function PasswordModal(props) {
  const { open, isGoogleUser, onClose } = props;
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();

  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  useEffect(() => {
    console.log(previousPassword);
  }, [previousPassword]);

  const handleSubmitChangePassword = () => {
    let body = {
      previousPassword: previousPassword,
      newPassword: newPassword,
    };
    toast.promise(
      axiosPrivate.post("/profile/update/password", JSON.stringify(body)),
      {
        loading: "Actualizando contraseña",
        success: (response) => {
          onClose();

          return <b>Se cambio la contraseña correctamente!</b>;
        },
        error: (error) => {
          return (
            <span>
              Ocurrio el siguiente cambiar contraseña: {error?.response?.data}
            </span>
          );
        },
      }
    );
    axiosPrivate
      .post("/profile/update/password", JSON.stringify(body))
      .then((response) => {})
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
        <div className={classes.header}>
          <div className={classes.headerLine}></div>
          <span className={classes.title}>CAMBIAR</span>
          <span className={classes.subTitle}>Contraseña</span>
        </div>

        <div className={classes.body}>
          {isGoogleUser ? (
            <></>
          ) : (
            <>
              <label style={{ color: colors.primary }}>
                Anterior Contraseña
              </label>
              <input
                type="text"
                name="previous"
                onChange={(e) => setPreviousPassword(e.target.value)}
                style={{ color: colors.primary, width: "70%", height: "2rem" }}
              ></input>
            </>
          )}
          <label style={{ color: colors.primary }}>Nueva Contraseña</label>
          <input
            type="text"
            name="previous"
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ color: colors.primary, width: "70%", height: "2rem" }}
          />
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            <button
              className={classes.closeButton}
              onClick={() => handleSubmitChangePassword()}
            >
              ¡Cambiar Contraseña!
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
    width: "30%",
    height: "70%",
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
    width: "12rem",
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
