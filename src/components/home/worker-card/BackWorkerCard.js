import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import ReviewCarousel from "./review-carousel/ReviewCarousel";
import { MDBIcon } from "mdb-react-ui-kit";
import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import { fetchWorkerReviewsExample } from "../../../connection/requests";

export default function BackWorkerCard(props) {
  const { auth } = useAuth();
  const classes = useStyles();
  const { workerData, onGoogleLogin, infoOnly } = props;
  const [workerReviews, setWorkerReviews] = useState([]);

  useEffect(() => {
    getReviews();
  }, [workerData]);

  const getReviews = () => {
    if (workerData?.user?.totalReviews > 0)
      fetchWorkerReviewsExample(workerData?.user?.id)
        .then((response) => {
          setWorkerReviews(response.data);
        })
        .catch((error) => console.log(error));
    else {
      setWorkerReviews([]);
    }
  };

  return (
    <div className={classes.backContainer}>
      <div className={classes.backInfoContainer}>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Descripcion</p>
          <span className={classes.infoText}>
            "{workerData?.user?.description}"
          </span>
        </div>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Horarios</p>
          <span className={classes.infoText}>
            {workerData?.user?.workingHours}
          </span>
        </div>
      </div>
      <div className={classes.reviewContainer}>
        <span className={classes.reviewTitle}>Opiniones del trabajador</span>
        <div className={classes.reviewCarousel}>
          <ReviewCarousel reviews={workerReviews} />
          {workerData?.user?.totalReviews > 0 ? (
            <button className={classes.opinionButton}>
              Ver todas las opiniones!
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {infoOnly ? (
        <></>
      ) : (
        <div className={classes.buttonContainer}>
          {auth?.accessToken ? (
            <div className={classes.loginContainer}>
              <button
                onClick={() => {
                  props.onInteract(workerData?.user?.id, "CLIENT_LIKE");
                }}
                className={classes.contactButton}
              >
                Contactalo!
              </button>
            </div>
          ) : (
            <div className={classes.loginContainer}>
              <p className={classes.loginInfoText}>
                Para comunicarte debes iniciar sesion!
              </p>
              <button
                onClick={() => onGoogleLogin()}
                className={classes.loginButton}
              >
                <MDBIcon fab icon="google"></MDBIcon>
                <p>Inicia sesion!</p>
              </button>
            </div>
          )}
        </div>
      )}
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
  contactButton: {
    width: "60%",
    height: "60%",
    borderRadius: "10px",
    backgroundColor: colors.primary,
    color: colors.white,
  },
});
