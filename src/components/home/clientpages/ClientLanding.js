import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import { useEffect, useState } from "react";
import WorkerCard from "../worker-card/WorkerCard";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../../pagewrappers/Nav";
import ClientSearchLoader from "../search-loaders/ClientSearchLoader";
import { useNavigate, useLocation } from "react-router-dom";
import useGeoLocation from "../../../hooks/useGeoLocation";
import { searchWorkersUnlogged } from "../../../connection/requests";
import useAuth from "../../../hooks/useAuth";
import { interactWithWorker } from "../../../connection/requests";

export default function ClientLanding(props) {
  const { auth } = useAuth();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { geoLocation, setGeoLocation } = useGeoLocation();
  const workerCategory = location.state?.workerCategory;
  const importance = location.state?.importance;
  const problemDescription = location.state?.problemDescription;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workerCategory && importance) {
      searchWorkers();
    } else navigate("/");
  }, []);

  const searchWorkers = () => {
    let searchInfo = {
      professionName: workerCategory,
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude,
    };
    searchWorkersUnlogged(searchInfo)
      .then((response) => {
        console.log(response.data);
        setWorkers(response.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleInteraction = (workerId, interactionType) => {
    let interactionInfo = {
      workerId: workerId,
      interactionType: interactionType,
      clientProblemDescription: problemDescription,
    };
    interactWithWorker(auth.accessToken, interactionInfo)
      .then((response) => navigate("/chat"))
      .catch((error) => console.log(error));
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
            Ten en cuenta que solo puedes comunicarte con 3 trabajadores al
            mismo tiempo.
          </span>
          <motion.div layout className={classes.resultsContainer}>
            {workers.map((worker) => {
              return (
                <WorkerCard
                  key={worker.worker.id}
                  workerData={worker}
                  onInteract={(workerId, interactionType) => {
                    handleInteraction(workerId, interactionType);
                  }}
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
    height: "100%",
    paddingTop: "12rem",
    background: `linear-gradient(${colors.primary},${colors.primary})`,
    fontFamily: "Montserrat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
});
