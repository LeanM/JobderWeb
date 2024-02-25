import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import ReactCardFlip from "react-card-flip";
import { useEffect, useState } from "react";
import FrontWorkerCard from "./FrontWorkerCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackWorkerCard from "./BackWorkerCard";

export default function WorkerCard(props) {
  const navigate = useNavigate();
  const { workerData, onInteract, onGoogleLogin, infoOnly } = props;
  const classes = useStyles();
  const [actualWorkerData, setActualWorkerData] = useState(workerData);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setActualWorkerData(workerData);
  }, [workerData]);

  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={classes.container}
      onMouseOver={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <ReactCardFlip
        flipSpeedFrontToBack={2}
        flipSpeedBackToFront={1}
        containerStyle={{ width: "100%", height: "100%", borderRadius: "10px" }}
        isFlipped={isFlipped}
      >
        <FrontWorkerCard
          infoOnly={infoOnly ? infoOnly : false}
          workerData={actualWorkerData}
        />
        <BackWorkerCard
          workerData={actualWorkerData}
          infoOnly={infoOnly ? infoOnly : false}
          onInteract={(workerId, interactionType) =>
            onInteract(workerId, interactionType)
          }
          onGoogleLogin={() => onGoogleLogin()}
        />
      </ReactCardFlip>
    </motion.div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "20rem",
    height: "32rem",
    borderRadius: "10px",
  },
});
