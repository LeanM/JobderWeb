import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors.js";
import { Button } from "@mui/material";
import Nav from "../pagewrappers/Nav.js";
import WorkerCategorySelect from "./WorkerCategorySelect.js";
import RadioSelection from "./RadioSelection/RadioSelection.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGeolocated } from "react-geolocated";
import useGeoLocation from "../../hooks/useGeoLocation.js";
import useAuth from "../../hooks/useAuth.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";

export default function Home() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const classes = useStyles();
  const { geoLocation, setGeoLocation } = useGeoLocation();
  const axiosPrivate = useAxiosPrivate();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      setGeoLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  }, [coords]);

  const [actualWorkerCategory, setActualWorkerCategory] = useState("");
  const [actualImportance, setActualImportance] = useState("");
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Urgente", itemCode: "AVAILABLE" },
    { id: 2, itemName: "Moderado", itemCode: "MODERATED" },
  ]);
  const [inputProblemText, setInputProblemText] = useState("");

  useEffect(() => {
    if (auth?.accessToken) {
      getUserSearchParametersIfLogged();
    }
  }, []);

  const getUserSearchParametersIfLogged = () => {
    fetchUserSearchParameters()
      .then((response) => {
        navigate("/clientLanding", {
          state: {
            workerCategory: response.data?.workSpecialization,
            importance: response.data?.availabilityStatus,
            problemDescription: response.data?.clientProblemDescription,
          },
        });
      })
      .catch((error) => console.log(error));
  };

  const fetchUserSearchParameters = async () => {
    return axiosPrivate.get("/profile/userSearchParameters");
  };

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
              Si quieres, describe en breves palabras tu problema
            </span>
            <input
              className={classes.inputText}
              type="text"
              placeholder="Tengo un problema con..."
              value={inputProblemText}
              onChange={(e) => setInputProblemText(e.target.value)}
            />
          </div>
          <div className={classes.selectionContainer}>
            <span className={classes.selectionLabel}>
              Que tan urgente es tu problema?
            </span>
            <RadioSelection
              selectionItemsArray={selectionItemsArray}
              onSelect={(selection) => handleSelectImportance(selection)}
            />
          </div>
          <button
            className={classes.searchButton}
            onClick={() => {
              if (actualImportance === "" || actualWorkerCategory === "") {
                toast.error("Seleccione todas las opciones!");
              } else if (!geoLocation?.latitude) {
                toast.error(
                  "Debes brindar tu ubicacion para obtener trabajadores cercanos!"
                );
              } else
                navigate("/clientLanding", {
                  state: {
                    workerCategory: actualWorkerCategory,
                    importance: actualImportance,
                    problemDescription: inputProblemText,
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
    height: "120vh",
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
  inputText: {
    width: "20rem",
    height: "3rem",
    outline: "none",
    border: "none",
    color: colors.primary,
    backgroundColor: colors.secondary,
  },
  searchButton: {
    fontWeight: "600",
    borderRadius: "10px",
    width: "8rem",
    height: "3rem",
    color: colors.primary,
    backgroundColor: colors.white,

    transition: "background 0.3s, color 0.3s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.white,
    },
  },
});
