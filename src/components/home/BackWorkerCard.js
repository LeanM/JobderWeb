import { createUseStyles } from "react-jss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../../assets/colors";

export default function BackWorkerCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { workerData } = props;
  return (
    <div className={classes.backContainer}>
      <div className={classes.backInfoContainer}>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Descripcion</p>
          <span className={classes.infoText}>"{workerData.descripcion}"</span>
        </div>
        <div className={classes.infoBlock}>
          <p className={classes.infoLabel}>Horarios</p>
          <span className={classes.infoText}>De corrido</span>
        </div>
      </div>
      <div className={classes.reviewContainer}>
        <span>Opiniones del trabajador</span>
        <div></div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          onClick={() =>
            navigate("/detailedWorker", {
              state: { workerData: workerData },
            })
          }
        >
          Ver en detalle!
        </Button>
      </div>
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
    height: "70%",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  infoBlock: {
    width: "90%",
    height: "25%",
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
    height: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    height: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: { color: "red" },
});
