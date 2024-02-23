import { useContext, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import Reveal from "../animations/Reveal";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useGeoLocation from "../../hooks/useGeoLocation";
import { socialLogIn } from "../../connection/requests";

export default function Nav(props) {
  const navigate = useNavigate();
  const { geoLocation } = useGeoLocation();
  const { auth, setAuth, logOutAuth } = useAuth();
  const [navStyle, setNavStyle] = useState({});
  const [navButtonStyle, setNavButtonStyle] = useState({});
  const [logoStyle, setLogoStyle] = useState({});

  const [loginRegisterAccess, setLoginRegisterAccess] = useState([]);

  const classes = useStyles();
  /*
  useEffect(() => {
    setNavStyle(styleNavBarTransparent);
    setNavButtonStyle(styleButtonsTransparent);
    setLogoStyle(styleLogoTransparent);

    // Agregar un event listener para manejar cambios en el tamaño de la ventana
    window.addEventListener("resize", listenToScroll);
    window.addEventListener("scroll", listenToScroll);
    return () => {
      window.removeEventListener("scroll", listenToScroll);
      window.removeEventListener("resize", listenToScroll);
    };
  }, []);
  */
  const listenToScroll = () => {
    if (window.innerWidth > 800) {
      if (window.pageYOffset <= 50) {
        setNavStyle(styleNavBarTransparent);
        setNavButtonStyle(styleButtonsTransparent);
        setLogoStyle(styleLogoTransparent);
      } else {
        setNavStyle(styleNavBarSolid);
        setNavButtonStyle(styleButtonsSolid);
        setLogoStyle(styleLogoSolid);
      }
    } else {
      setNavStyle(styleNavBarTransparent);
      setNavButtonStyle(styleButtonsTransparent);
      setLogoStyle(styleLogoTransparent);
    }
  };

  const handleMouseOver = () => {
    //setNavStyle(styleNavBarSolid);
  };

  const styleNavBarTransparent = {
    backgroundColor: colors.transparent,
    height: "6rem",
  };

  const styleNavBarSolid = {
    backgroundColor: colors.navSemiTransparent,
    color: "black",
    borderBottom: `solid 2px ${colors.nav}`,
  };

  const styleButtonsTransparent = {
    color: "white",
    textShadow: "0 0 5px black",
  };

  const styleButtonsSolid = {
    color: "white",
    textShadow: "0 0 5px black",
  };

  const styleLogoTransparent = {
    width: "100%",
    height: "100%",
  };

  const styleLogoSolid = {
    width: "90%",
    height: "90%",
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      let authCode = response.code;
      let socialCredentials = {
        value: authCode,
        accountRole: "CLIENT",
        latitude: geoLocation?.latitude,
        longitude: geoLocation?.longitude,
      };

      toast.promise(socialLogIn(socialCredentials), {
        loading: "Logging In...",
        success: (response) => {
          const accessToken = response.data.accessToken;
          console.log(accessToken);
          setAuth({ accessToken: accessToken, role: response.data?.role });

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
    <Reveal
      style={navStyle}
      animationVariant="top"
      styles={classes.section}
      onMouseOver={handleMouseOver}
    >
      <nav className={classes.navBar}>
        <div className={classes.navBarFirstRow}>
          <div className={classes.enterpriseListItem}>
            <div className={classes.enterpriseContainer}>
              <img
                className={classes.logo}
                style={logoStyle}
                src={"./enterprise.png"}
                onClick={() => navigate("/")}
              ></img>
            </div>
          </div>
          <SideNav />
        </div>
        <div className={classes.navBarLowList}>
          {auth?.role === "WORKER" ? (
            <div
              className={classes.navBarListItem}
              style={navButtonStyle}
              onClick={() => {
                navigate("/reviews");
              }}
            >
              <div className={classes.navBarListItemTextContainer}>
                <p className={classes.navBarListItemText}>Opiniones</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={classes.navBarListItem}
                style={navButtonStyle}
                onClick={() => {
                  navigate("/");
                }}
              >
                <div className={classes.navBarListItemTextContainer}>
                  <p className={classes.navBarListItemText}>Busqueda</p>
                </div>
              </div>
              <div
                className={classes.navBarListItem}
                style={navButtonStyle}
                onClick={() => {
                  navigate("/history");
                }}
              >
                <div className={classes.navBarListItemTextContainer}>
                  <p className={classes.navBarListItemText}>Historial</p>
                </div>
              </div>
            </>
          )}
          <div
            className={classes.navBarListItem}
            onClick={() => {
              navigate("/chat");
            }}
            style={navButtonStyle}
          >
            <div className={classes.navBarListItemTextContainer}>
              <p className={classes.navBarListItemText}>Chats</p>
            </div>
          </div>
          <div
            style={navButtonStyle}
            className={classes.navBarListItem}
            onClick={() => {
              navigate("/profile");
            }}
          >
            <div className={classes.navBarListItemTextContainer}>
              <p className={classes.navBarListItemText}>
                {auth.accessToken ? "Mi cuenta" : "Ingresar"}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </Reveal>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    fontFamily: "Montserrat",
  },
  background: {
    backgroundColor: "white",
    position: "fixed",
    zIndex: -1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
  },
  section: {
    width: "100%",
    height: "12rem",
    display: "flex",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "0.5rem",
    zIndex: "1000",
    top: "0",
    transition: "background 0.5s, height 0.5s, border 0.5s",

    "@media screen and (max-width: 800px)": {
      //position: "absolute",
    },
  },
  navBar: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    "@media screen and (max-width: 800px)": {
      width: "90%",
    },
  },
  navBarLowList: {
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  navBarFirstRow: {
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  navBarListItem: {
    minWidth: "6rem",
    height: "70%",
    display: "flex",
    fontSize: "1rem",
    fontWeight: "700",
    marginTop: "auto",
    marginBottom: "auto",
    justifyContent: "center",
    color: colors.textSecondary,
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: colors.transparent,

    "@media screen and (max-width: 800px)": {
      display: "none",
    },
  },
  navBarListItemTextContainer: {
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: `1px solid ${colors.transparent}`,
    transition: "border 0.2s ease-in-out",

    "&:hover": {
      borderColor: colors.textSecondary,
    },
  },
  navBarListItemText: {
    textAlign: "center",
  },
  enterpriseListItem: {
    maxWidth: "25rem",
    height: "90%",
    display: "flex",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    justifyContent: "center",
    color: "white",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: colors.transparent,
    borderBottom: `1px solid ${colors.transparent}`,

    "@media screen and (max-width: 800px)": {
      width: "10rem",
    },
  },
  enterpriseContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "4.6rem",
    height: "6rem",
    marginTop: "auto",
    marginBottom: "auto",

    "@media screen and (max-width: 800px)": {
      width: "5.5rem",
      height: "6.5rem",
    },

    "@media screen and (max-width: 500px)": {
      width: "4.5rem",
      height: "5.5rem",
    },
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
    transition: "width 0.5s, height 0.5s, box-shadow 0.3s",
    borderRadius: "15px",
    "&:hover": {
      boxShadow: "white 0 0 8px",
    },
  },
});
