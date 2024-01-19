import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import WorkerCard from "./worker-card/WorkerCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLanding(props) {
  const classes = useStyles();
  const [workers, setWorkers] = useState([]);

  const mock = [
    {
      nombre: "Juan",
      descripcion: "Experto en construcción",
      distancia: 10,
      rating: 4.5,
    },
    {
      nombre: "María",
      descripcion: "Diseñadora de interiores",
      distancia: 20,
      rating: 3.8,
    },
    {
      nombre: "Carlos",
      descripcion: "Fontanero certificado",
      distancia: 15,
      rating: 4.0,
    },
    // Agrega más trabajadores según tus necesidades
    {
      nombre: "Ana",
      descripcion: "Electricista profesional",
      distancia: 12,
      rating: 4.2,
    },
    {
      nombre: "Pedro",
      descripcion: "Pintor especializado",
      distancia: 25,
      rating: 3.5,
    },
    {
      nombre: "Laura",
      descripcion: "Carpintera experta",
      distancia: 18,
      rating: 4.1,
    },
    // ... Agrega más trabajadores
    {
      nombre: "José",
      descripcion: "Plomero con experiencia",
      distancia: 8,
      rating: 4.8,
    },
    {
      nombre: "Sofía",
      descripcion: "Arquitecta de renombre",
      distancia: 30,
      rating: 4.7,
    },
    {
      nombre: "Miguel",
      descripcion: "Ingeniero civil",
      distancia: 22,
      rating: 3.9,
    },
    // ... Continúa agregando trabajadores
  ];

  useEffect(() => {
    setWorkers(mock);
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <span className={classes.title}>¡Trabajadores para ti!</span>
        <span className={classes.subTitle}>
          Ten en cuenta que solo puedes comunicarte con 3 trabajadores al mismo
          tiempo.
        </span>
        <motion.div layout className={classes.resultsContainer}>
          {workers.map((worker) => {
            return <WorkerCard key={worker.nombre} workerData={worker} />;
          })}
        </motion.div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    background: `linear-gradient(${colors.primary},${colors.primary})`,
    fontFamily: "Poppins",
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
