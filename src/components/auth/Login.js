import { React } from "react";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { MDBIcon } from "mdb-react-ui-kit";
import useGeoLocation from "../../hooks/useGeoLocation";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";

function LogIn() {
  const { logInAuth, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { geoLocation, getGeoLocationForRegister } = useGeoLocation();
  const from = location.state?.from || "/";

  const classes = useStyles();

  const userRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    logInAuth(email, pwd);
  };

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
    <div className={classes.container}>
      <section className={classes.loginRegisterContainer}>
        <div className={classes.topContainer}>
          <p
            ref={errorRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Inicia Sesion</h1>
          <button
            onClick={() => {
              getGeoLocationForRegister();
              login();
            }}
            className={classes.googleLoginButton}
          >
            <MDBIcon fab icon="google"></MDBIcon>
            <p style={{ fontWeight: "300" }}>Inicia sesion con Google</p>
          </button>
        </div>
        <form className={classes.formContainer} onSubmit={handleSubmit}>
          <label
            className="login-register__label"
            style={{ fontSize: "1.2rem", fontWeight: "500" }}
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            ref={userRef}
            className={classes.input}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label
            style={{ fontSize: "1.2rem", fontWeight: "500" }}
            className="login-register__label"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className={classes.input}
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button className={classes.loginButton}>Iniciar Sesion</button>
        </form>
        <p>
          No estas registrado?
          <br />
          <span className="line">
            {/*put router link here*/}
            <Link className="login-register__link" to="/register">
              Registrarse
            </Link>
          </span>
        </p>
      </section>
    </div>
  );
}

export default LogIn;

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: colors.primary,
    fontFamily: "Oswald",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginRegisterContainer: {
    width: "20rem",
    height: "25rem",
    backgroundColor: colors.secondary,
    padding: "1rem",
    fontWeight: "200",
    borderRadius: "10px",
    color: colors.primary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
  },
  topContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
  },
  googleLoginButton: {
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    display: "flex",
    width: "10rem",
    height: "2rem",
    borderRadius: "20px",

    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "0.5rem",

    transition: "background 0.2s, color 0.2s",

    "&:hover": {
      backgroundColor: colors.textSecondary,
      color: colors.primary,
    },
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "start",
    width: "100%",
    height: "60%",
  },
  input: {
    width: "80%",
    outline: "none",
    backgroundColor: colors.secondary,
    border: "none",
    borderBottom: "solid 1px " + colors.textSecondary,
  },
  loginButton: {
    width: "10rem",
    height: "2.5rem",
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    borderRadius: "10px",
    fontSize: "1.2rem",

    transition: "background 0.2s, color 0.2s",

    "&:hover": {
      backgroundColor: colors.textSecondary,
      color: colors.primary,
    },
  },
});
