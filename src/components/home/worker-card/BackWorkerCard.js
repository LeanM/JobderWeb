import { createUseStyles } from "react-jss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../../../assets/colors";
import ReviewCarousel from "./review-carousel/ReviewCarousel";
import { MDBIcon } from "mdb-react-ui-kit";
import useAuth from "../../../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { socialLogIn } from "../../../connection/requests";

export default function BackWorkerCard(props) {
  const { auth, setAuth } = useAuth();
  const classes = useStyles();
  const navigate = useNavigate();
  const { workerData } = props;

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      let authCode = response.code;
      let socialCredentials = {
        value: authCode,
      };

      toast.promise(socialLogIn(socialCredentials), {
        loading: "Logging In...",
        success: (response) => {
          const accessToken = response.data.accessToken;
          setAuth({ accessToken });

          return <b>Successfuly logged in!</b>;
        },
        error: (error) => {
          return (
            <span>
              The next error happened while making loggin :{" "}
              {error?.response?.data?.errors}
            </span>
          );
        },
      });
    },
  });

  return (
    <div className={classes.backContainer}>
      <div className={classes.backInfoContainer}>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Descripcion</p>
          <span className={classes.infoText}>"{workerData.descripcion}"</span>
        </div>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Horarios</p>
          <span className={classes.infoText}>De corrido</span>
        </div>
      </div>
      <div className={classes.reviewContainer}>
        <span className={classes.reviewTitle}>Opiniones del trabajador</span>
        <div className={classes.reviewCarousel}>
          <ReviewCarousel />
          <button className={classes.opinionButton}>
            Ver todas las opiniones!
          </button>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        {auth?.accessToken ? (
          <Button>Comunicate!</Button>
        ) : (
          <div className={classes.loginContainer}>
            <p className={classes.loginInfoText}>
              Para comunicarte debes iniciar sesion!
            </p>
            <button onClick={() => login()} className={classes.loginButton}>
              <MDBIcon fab icon="google"></MDBIcon>
              <p>Inicia sesion!</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  backContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.textSecondary,
    borderRadius: "10px",
  },
  backInfoContainer: {
    height: "45%",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  infoBlock: {
    width: "90%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    flexDirection: "column",
    gap: "0.5rem",
    color: colors.primary,
  },
  infoLabel: {
    fontWeight: "700",
  },
  reviewContainer: {
    width: "100%",
    height: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTitle: {
    color: colors.primary,
    fontWeight: "700",
  },
  reviewCarousel: {
    height: "80%",
    width: "97%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.2rem",
  },
  opinionButton: {
    color: colors.primary,
    backgroundColor: colors.transparent,
    fontWeight: "400",
    fontSize: "0.9rem",
    textAlign: "center",
    border: "none",
    borderBottom: "solid 1px " + colors.transparent,

    transition: "border 0.5s, text-shadow 0.5s",

    "&:hover": {
      //borderBottom: "solid 1px " + colors.white,
      textShadow: "0 0 5px white",
    },
  },
  buttonContainer: {
    width: "100%",
    height: "13%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  loginContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  loginInfoText: {
    color: colors.primary,
  },
  loginButton: {
    display: "flex",
    width: "60%",
    height: "60%",
    borderRadius: "20px",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    fontWeight: "600",
    backgroundColor: colors.notificationLight,
    color: colors.notification,

    transition: "background 0.5s",

    "&:hover": {
      backgroundColor: colors.white,
      color: colors.notification,
    },
  },
});
