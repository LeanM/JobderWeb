import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors.js";
import { Button } from "@mui/material";
import Nav from "../pagewrappers/Nav.js";
import WorkerCategorySelect from "./WorkerCategorySelect.js";
import RadioSelection from "./RadioSelection/RadioSelection.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [actualWorkerCategory, setActualWorkerCategory] = useState("");
  const [actualImportance, setActualImportance] = useState("");

  const handleSelectWorkerCategory = (selection) => {
    setActualWorkerCategory(selection);
  };

  const handleSelectImportance = (selection) => {
    setActualImportance(selection);
  };

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <span className={classes.title}>
            Encuentra un trabajador para tu inconveniente!
          </span>
          <div className={classes.selectionContainer}>
            <span className={classes.selectionLabel}>
              Que tipo de trabajador buscas?
            </span>
            <WorkerCategorySelect
              onSelect={(selection) => handleSelectWorkerCategory(selection)}
            />
          </div>
          <div className={classes.selectionContainer}>
            <span className={classes.selectionLabel}>
              Que tan urgente es tu problema?
            </span>
            <RadioSelection
              onSelect={(selection) => handleSelectImportance(selection)}
            />
          </div>
          <button
            className={classes.searchButton}
            onClick={() => {
              if (actualImportance === "" || actualWorkerCategory === "") {
                toast.error("Selecciona las opciones!");
              } else
                navigate("/clientLanding", {
                  state: {
                    workerCategory: actualWorkerCategory,
                    importance: actualImportance,
                  },
                });
            }}
          >
            ¡Buscar!
          </button>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    paddingTop: "12rem",
    background: `linear-gradient(${colors.primary},${colors.primary})`,
    fontFamily: "Montserrat",
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
    gap: "1rem",
  },
  selectionLabel: {
    fontWeight: "200",
    fontSize: "1rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  searchButton: {
    fontWeight: "600",
    borderRadius: "20px",
    width: "8rem",
    height: "3rem",
    color: colors.primary,
    backgroundColor: colors.secondary,
  },
});
