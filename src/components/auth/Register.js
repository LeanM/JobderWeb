import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/login-register.css";
import { registerSubmission } from "../../connection/requests";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

const EMAIL_REGEX = /.+@.+\.[A-Za-z]+$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidName(USER_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    toast.promise(
      registerSubmission({
        email: email,
        password: pwd,
        name: name,
      }),
      {
        loading: "User registration in progress...",
        success: (response) => {
          //Change the register view to show a log-in page button
          setSuccess(true);
          //clear state and controlled inputs
          setEmail("");
          setPwd("");
          setMatchPwd("");

          return <b>Successfuly registered user!</b>;
        },
        error: (error) => {
          console.log(error);
          return (
            <span>
              The following error happen while trying to make registration :{" "}
              {error?.response?.data.email}
            </span>
          );
        },
      }
    );
  };

  return (
    <div className="login-register__container">
      <div className="login-register__body">
        {success ? (
          <section className="login-register__section">
            <h1>Success!</h1>
            <p>
              <Link className="login-register__link" to="/login">
                Sign In
              </Link>
            </p>
          </section>
        ) : (
          <section className="login-register__section">
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>Register</h1>
            <form className="login-register__form" onSubmit={handleSubmit}>
              <label className="login-register__label" htmlFor="email">
                Email
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              {/* Information paragraph for typing a valid user */}
              <p
                id="uidnote"
                className={
                  //If not focused or user is empty(not already try a user) or the actual
                  //user is valid, not show help.
                  userFocus && email && !validEmail
                    ? "email-instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must be a valid email.
              </p>
              <label className="login-register__label" htmlFor="name">
                Your Name
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validName ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={!name ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="name"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              {/* Information paragraph for typing a valid user */}
              <p
                id="uidnote"
                className={
                  //If not focused or user is empty(not already try a user) or the actual
                  //user is valid, not show help.
                  userFocus && name && !validName
                    ? "name-instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must be a valid name.
              </p>
              {/* Password block */}
              <label className="login-register__label" htmlFor="password">
                Password
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !pwd ? "hide" : "invalid"}
                />
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd ? "password-instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>

              <label className="login-register__label" htmlFor="confirm_pwd">
                Confirm Password
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPwd ? "hide" : "invalid"}
                />
              </label>
              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "confirmpassword-instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>

              <button
                className="login-register__submitbutton"
                disabled={!validName || !validPwd || !validMatch ? true : false}
              >
                Sign Up
              </button>
            </form>
            <p>
              Already registered?
              <br />
              <span className="line">
                {/*put router link here*/}
                <Link className="login-register__link" to="/login">
                  Sign In
                </Link>
              </span>
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Register;
