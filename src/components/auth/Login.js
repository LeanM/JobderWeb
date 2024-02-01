import { React } from "react";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { socialLogIn } from "../../connection/requests";
import { MDBIcon } from "mdb-react-ui-kit";

function LogIn() {
  const { logInAuth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

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
      };

      toast.promise(socialLogIn(socialCredentials), {
        loading: "Logging In...",
        success: (response) => {
          console.log(response.data);
          const accessToken = response.data.accessToken;
          navigate(from, { replace: true });
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
    <div className="login-register__container">
      <div className="login-register__body">
        <section className="login-register__section">
          <p
            ref={errorRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Log In</h1>
          <button
            onClick={() => login()}
            style={{
              display: "flex",
              width: "10rem",
              height: "2rem",
              borderRadius: "20px",
              boxShadow: "0 0 10px black",
              justifyContent: "space-evenly",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "white",
            }}
          >
            <MDBIcon style={{ color: "red" }} fab icon="google"></MDBIcon>
            <p style={{ color: "red", fontWeight: "600" }}>
              Sign In With Google
            </p>
          </button>
          <form className="login-register__form" onSubmit={handleSubmit}>
            <label className="login-register__label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <label className="login-register__label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button className="login-register__submitbutton">Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link className="login-register__link" to="/register">
                Sign Up
              </Link>
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LogIn;
