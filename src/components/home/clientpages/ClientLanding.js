import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import { useEffect, useState } from "react";
import WorkerCard from "../worker-card/WorkerCard";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../../pagewrappers/Nav";
import ClientSearchLoader from "../search-loaders/ClientSearchLoader";
import { useNavigate, useLocation } from "react-router-dom";
import useGeoLocation from "../../../hooks/useGeoLocation";
import { fetchWorkersUnlogged } from "../../../connection/requests";
import useAuth from "../../../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

export default function ClientLanding(props) {
  const { auth, resetSearchParameters, loginGoogle } = useAuth();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { geoLocation } = useGeoLocation();
  const workerCategory = location.state?.workerCategory;
  const importance = location.state?.importance;
  const problemDescription = location.state?.problemDescription;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (workerCategory && importance) {
      if (auth?.accessToken) searchWorkersLogged();
      else searchWorkersNotLogged();
    } else navigate("/");
  }, []);

  const searchWorkersNotLogged = () => {
    let searchInfo = {
      workSpecialization: workerCategory,
      latitude: geoLocation?.latitude,
      longitude: geoLocation?.longitude,
      availabilityStatus: importance,
      minimumDistanceInKm: 50,
    };
    if (!searchInfo.latitude || !searchInfo.longitude) {
      navigate("/");
    } else {
      fetchWorkersUnlogged(searchInfo)
        .then((response) => {
          setWorkers(response.data);
          setLoading(false);
        })
        .catch((error) => navigate("/"));
    }
  };

  const searchWorkersLogged = () => {
    let searchInfo = {
      workSpecialization: workerCategory,
      clientProblemDescription: problemDescription,
      availabilityStatus: importance,
      minimumDistanceInKm: 50,
    };

    fetchWorkersLogged(searchInfo)
      .then((response) => {
        setWorkers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 401)
          navigate("/login", {
            state: { from: "/clientLanding" },
            replace: true,
          });

        if (error?.response?.status === 400) {
          toast.error(error?.response?.data);
          navigate("/profile");
        }
      });
  };

  const fetchWorkersLogged = async (searchInfo) => {
    return axiosPrivate.post(
      "/search/client/searchWorkers",
      JSON.stringify(searchInfo)
    );
  };

  const handleInteraction = (workerId, interactionType) => {
    let interactionInfo = {
      workerId: workerId,
      interactionType: interactionType,
      clientProblemDescription: problemDescription,
    };

    interactWithWorker(interactionInfo)
      .then((response) => navigate("/chat"))
      .catch((error) => {
        if (error?.response?.status === 401)
          navigate("/login", {
            state: { from: "/clientLanding" },
            replace: true,
          });
      });
  };

  const interactWithWorker = async (interactionInfo) => {
    return axiosPrivate.post(
      "matching/client/interaction",
      JSON.stringify(interactionInfo)
    );
  };

  const onGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      let authCode = response.code;
      let searchParameters = {
        workSpecialization: workerCategory,
        clientProblemDescription: problemDescription,
        availabilityStatus: importance,
      };
      let socialCredentials = {
        value: authCode,
        accountRole: "CLIENT",
        searchParameters: searchParameters,
      };

      loginGoogle(socialCredentials, geoLocation);
    },
  });

  const handleResetUserSearch = () => {
    if (auth?.accessToken) {
      fetchResetUserSearch()
        .then((response) => navigate("/"))
        .catch((error) => {
          if (error?.response?.status === 401)
            navigate("/login", {
              state: { from: "/clientLanding" },
              replace: true,
            });
        });
    } else navigate("/");
  };

  const fetchResetUserSearch = async () => {
    return axiosPrivate.get("/profile/resetUserSearchParameters");
  };

  return loading ? (
    <ClientSearchLoader />
  ) : (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <span className={classes.title}>¡Trabajadores para ti!</span>
          <span className={classes.subTitle}>
            Tu busqueda actual esta conformada por trabadores de tipo{" "}
            {workerCategory} con grado de importancia{" "}
            {importance === "AVAILABLE" ? "alto" : "moderado"}
            {problemDescription
              ? ', para el siguiente problema: "' + problemDescription + '"'
              : ""}
            .
          </span>
          <button
            className={classes.resetSearchButton}
            onClick={() => {
              handleResetUserSearch();
            }}
          >
            Realizar busqueda diferente
          </button>

          <motion.div layout className={classes.resultsContainer}>
            {workers.map((worker) => {
              return (
                <WorkerCard
                  key={worker.worker.id}
                  workerData={worker}
                  onInteract={(workerId, interactionType) => {
                    handleInteraction(workerId, interactionType);
                  }}
                  onGoogleLogin={() => onGoogleLogin()}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    minHeight: "200vh",
    paddingTop: "12rem",
    background: `linear-gradient(${colors.primary},${colors.primary})`,
    fontFamily: "Montserrat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subContainer: {
    width: "90%",
    height: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "2em",
  },
  title: {
    fontWeight: "800",
    fontSize: "3rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  subTitle: {
    fontWeight: "200",
    fontSize: "1rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  resultsContainer: {
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  resetSearchButton: {
    width: "15rem",
    height: "3rem",
    borderRadius: "10px",
    border: `1px solid ${colors.secondary}`,
    backgroundColor: colors.primary,

    color: colors.textSecondary,

    transition: "color 0.3s, background 0.3s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },
  },
});
