import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import { useEffect, useState } from "react";
import WorkerCard from "../worker-card/WorkerCard";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../../pagewrappers/Nav";
import ClientSearchLoader from "../search-loaders/ClientSearchLoader";
import { useNavigate, useLocation } from "react-router-dom";

export default function ClientLanding(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const workerCategory = location.state?.workerCategory;
  const importance = location.state?.importance;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mock = [
    {
      nombre: "Juan",
      descripcion: "Experto en construcción",
      distancia: 10,
      rating: 4.5,
      trabajos: 264,
      status: "active",
    },
    {
      nombre: "María",
      descripcion: "Diseñadora de interiores",
      distancia: 20,
      rating: 3.8,
      trabajos: 12,
      status: "ocuppied",
    },
    {
      nombre: "Carlos",
      descripcion: "Fontanero certificado",
      distancia: 15,
      rating: 4.0,
      trabajos: 516,
      status: "moderated",
    },
    // Agrega más trabajadores según tus necesidades
    {
      nombre: "Ana",
      descripcion: "Electricista profesional",
      distancia: 12,
      rating: 4.2,
      trabajos: 56,
      status: "active",
    },
  ];

  useEffect(() => {
    if (workerCategory && importance) {
      searchWorkers();
    } else navigate("/");
  }, []);

  const searchWorkers = () => {
    setWorkers(mock);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
              return <WorkerCard key={worker.nombre} workerData={worker} />;
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
