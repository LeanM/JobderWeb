import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import { useCallback, useEffect, useRef, useState } from "react";
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
import ReactLoading from "react-loading";

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
  const [isSearchingMoreWorkers, setIsSearchingMoreWorkers] = useState(false);
  const [canSearch, setCanSearch] = useState(true);
  const [actualInitialPage, setActualInitialPage] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const observer = useRef();
  const lastWorkerRef = useCallback(
    (node) => {
      if (loading || isSearchingMoreWorkers) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canSearch) {
          initialiceSearch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isSearchingMoreWorkers, canSearch]
  );

  useEffect(() => {
    initialiceSearch();
  }, []);

  const initialiceSearch = () => {
    if (workerCategory && importance) {
      setIsSearchingMoreWorkers(true);
      if (auth?.accessToken) searchWorkersLogged();
      else searchWorkersNotLogged();
    } else navigate("/");
  };

  const searchWorkersNotLogged = () => {
    let searchInfo = {
      workSpecialization: workerCategory,
      latitude: geoLocation?.latitude,
      longitude: geoLocation?.longitude,
      availabilityStatus: importance,
      minimumDistanceInKm: 50,
      initialPage: actualInitialPage,
    };
    if (!searchInfo.latitude || !searchInfo.longitude) {
      toast.error("Debes especificar tu ubicacion para buscar trabajadores!");
      navigate("/");
    } else {
      fetchWorkersUnlogged(searchInfo)
        .then((response) => {
          const newWorkers = response.data?.workerSearchData;
          if (newWorkers?.length !== 0) {
            setWorkers([...workers, ...newWorkers]);
            setActualInitialPage(response.data?.paginationData?.newInitialPage);
          } else setCanSearch(false);
          setLoading(false);
          setIsSearchingMoreWorkers(false);
        })
        .catch((error) => {
          setIsSearchingMoreWorkers(false);
          setLoading(false);
          setCanSearch(false);
          //navigate("/");
          toast.error(error?.response?.data);
        });
    }
  };

  const searchWorkersLogged = () => {
    let searchInfo = {
      workSpecialization: workerCategory,
      clientProblemDescription: problemDescription,
      availabilityStatus: importance,
      minimumDistanceInKm: 50,
      initialPage: actualInitialPage,
    };

    fetchWorkersLogged(searchInfo)
      .then((response) => {
        const newWorkers = response.data?.workerSearchData;
        if (newWorkers?.length !== 0) {
          setWorkers([...workers, ...newWorkers]);
          setActualInitialPage(response.data?.paginationData?.newInitialPage);
        } else setCanSearch(false);
        setLoading(false);
        setIsSearchingMoreWorkers(false);
      })
      .catch((error) => {
        setIsSearchingMoreWorkers(false);
        setLoading(false);
        if (error?.response?.status === 401)
          navigate("/login", {
            state: { from: "/clientLanding" },
            replace: true,
          });

        if (error?.response?.status === 400) {
          toast.error(error?.response?.data);
          //navigate("/profile");
        }
        setCanSearch(false);
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
      clientUrgency: importance,
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
            {workers.map((worker, index) => {
              return (
                <WorkerCard
                  key={worker?.user?.id}
                  workerData={worker}
                  onInteract={(workerId, interactionType) => {
                    handleInteraction(workerId, interactionType);
                  }}
                  onGoogleLogin={() => onGoogleLogin()}
                />
              );
            })}
          </motion.div>
          <div className={classes.searchStatus} ref={lastWorkerRef}>
            {isSearchingMoreWorkers ? (
              <ReactLoading
                type="spinningBubbles"
                color={colors.secondary}
                height={"2rem"}
                width={"3rem"}
              />
            ) : !canSearch ? (
              <span style={{ textAlign: "center", color: colors.secondary }}>
                No hay mas trabajadores cercanos para esos prametros de
                busqueda!
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    minHeight: "100vh",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.primary,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  searchStatus: {
    width: "100%",
    height: "13vh",
    marginTop: "25vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    backgroundColor: colors.primary,
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
