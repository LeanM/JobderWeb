import { createUseStyles } from "react-jss";
import Nav from "../pagewrappers/Nav";
import { colors } from "../../assets/colors";
import Reveal from "../animations/Reveal";
import { useGoogleLogin } from "@react-oauth/google";
import { MDBIcon } from "mdb-react-ui-kit";
import useGeoLocation from "../../hooks/useGeoLocation";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const { loginGoogle } = useAuth();
  const classes = useStyles();
  const { geoLocation, getGeoLocationForRegister } = useGeoLocation();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      let authCode = response.code;
      let socialCredentials = {
        value: authCode,
        accountRole: "CLIENT",
      };
      loginGoogle(socialCredentials, geoLocation);
    },
  });

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <Reveal animationVariant="bottom" styles={classes.subContainer}>
          <div className={classes.clientSelectionContainer}>
            <div className={classes.innerContainer}>
              <span
                className={classes.title}
                style={{ color: colors.secondary }}
              >
                Registrate como Cliente!
              </span>
              <div className={classes.buttonsContainer}>
                <button
                  className={classes.button}
                  onClick={() => navigate("/registerClient")}
                >
                  Registro comun
                </button>
                <button
                  className={classes.button}
                  onClick={() => {
                    getGeoLocationForRegister();

                    login();
                  }}
                >
                  <MDBIcon
                    style={{ color: colors.secondary }}
                    fab
                    icon="google"
                  ></MDBIcon>
                  Registro con google
                </button>
              </div>
            </div>
          </div>
          <div className={classes.workerSelectionContainer}>
            <div className={classes.innerContainer}>
              <span className={classes.title} style={{ color: colors.primary }}>
                Registrate como Trabajador!
              </span>
              <div className={classes.buttonsContainer}>
                <button
                  className={classes.button}
                  onClick={() => navigate("/registerWorker")}
                >
                  Registro comun
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "90vh",
    paddingTop: "8rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    fontFamily: "Montserrat",
  },
  subContainer: {
    width: "80%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clientSelectionContainer: {
    width: "45%",
    height: "100%",
    backgroundColor: colors.primaryDark,
    display: "flex",
    justifyContent: "center",
    borderRadius: "5px 0 0 5px",
    alignItems: "center",
  },
  title: {
    fontSize: "3.5rem",
    textAlign: "center",
    fontWeight: "700",
  },
  innerContainer: {
    height: "80%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonsContainer: {
    height: "70%",
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "2rem",
  },
  button: {
    display: "flex",
    borderRadius: "20px",
    boxShadow: "0 0 5px black",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: colors.primary,
    fontWeight: "400",
    fontSize: "1rem",
    width: "80%",
    height: "3rem",
    color: colors.textSecondary,

    transition: "background 0.3s, color 0.3s",

    "&:hover": {
      backgroundColor: colors.textSecondary,
      color: colors.primary,
    },
  },
  workerSelectionContainer: {
    width: "45%",
    height: "100%",
    backgroundColor: colors.secondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "0 5px 5px 0",
  },
});
