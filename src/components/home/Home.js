import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors.js";
import { Button } from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <span className={classes.title}>
          Encuentra un trabajador para tu inconveniente!
        </span>
        <div className={classes.selectionContainer}>
          <span className={classes.selectionLabel}>
            Que tipo de trabajador buscas?
          </span>
        </div>
        <div className={classes.selectionContainer}>
          <span className={classes.selectionLabel}>
            Que tan urgente es tu problema?
          </span>
        </div>
        <Button
          className={classes.searchButton}
          onClick={() => navigate("/clientLanding")}
        >
          ¡Buscar!
        </Button>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    background: `linear-gradient(${colors.primary},${colors.primary})`,
    fontFamily: "Poppins",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "80%",
    height: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "2em",
  },
  title: {
    fontWeight: "800",
    fontSize: "4rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  selectionContainer: {
    width: "80%",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionLabel: {
    fontWeight: "200",
    fontSize: "1rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  searchButton: {
    fontFamily: "Poppins",
    fontWeight: "600",
    color: colors.white,
    backgroundColor: colors.secondary,
  },
});
