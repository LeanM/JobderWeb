import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors.js";
import { Button } from "@mui/material";
import Nav from "../pagewrappers/Nav.js";
import WorkerCategorySelect from "./WorkerCategorySelect.js";
import RadioSelection from "./RadioSelection/RadioSelection.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import useGeoLocation from "../../hooks/useGeoLocation.js";
import { MDBIcon } from "mdb-react-ui-kit";
import { Modal } from "rsuite";
import InfoModal from "./InfoModal.js";

export default function Home() {
  const { geoLocation, getGeoLocationForSearch } = useGeoLocation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const classes = useStyles();
  const axiosPrivate = useAxiosPrivate();

  const [actualWorkerCategory, setActualWorkerCategory] = useState("");
  const [actualImportance, setActualImportance] = useState("");
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Urgente", itemCode: "AVAILABLE" },
    { id: 2, itemName: "Moderado", itemCode: "MODERATED" },
  ]);
  const [inputProblemText, setInputProblemText] = useState("");

  const [openInfoModal, setOpenInfoModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserSearchParametersIfLogged();
  }, []);

  const getUserSearchParametersIfLogged = () => {
    fetchUserSearchParameters()
      .then((response) => {
        const workerCategory = response.data?.workSpecialization;
        const importance = response.data?.availabilityStatus;
        const problemDescription = response.data?.clientProblemDescription;

        if (workerCategory && importance) {
          navigate("/clientLanding", {
            state: {
              workerCategory: workerCategory,
              importance: importance,
              problemDescription: problemDescription,
            },
          });
        }
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
      <InfoModal
        open={openInfoModal}
        onClose={() => {
          getGeoLocationForSearch();
          setOpenInfoModal(false);
        }}
      />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <span className={classes.title}>
            Encuentra un trabajador para tu inconveniente!
          </span>
          <div className={classes.selectionContainer}>
            <span className={classes.selectionLabel}>
              Que tipo de trabajador buscas?
            </span>
            <div style={{ width: "40%" }}>
              <WorkerCategorySelect
                onSelect={(selection) => handleSelectWorkerCategory(selection)}
              />
            </div>
          </div>
          <div className={classes.selectionContainer}>
            <span className={classes.selectionLabel}>
              Si quieres, describe en breves palabras tu problema
            </span>
            <textarea
              className={classes.inputText}
              type="text"
              rows="5"
              placeholder="Tengo un problema con..."
              value={inputProblemText}
              onChange={(e) => setInputProblemText(e.target.value)}
            />
            <style>
              {` 
                    ::placeholder { 
                        color: ${colors.textSecondary}; 
                    }`}
            </style>
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
          {!geoLocation?.longitude && !auth?.accessToken ? (
            <div className={classes.infoLocationContainer}>
              <MDBIcon icon="pin" />
              <span style={{ color: colors.notificationLight }}>
                Debes habilitar la ubicacion en tu navegador o ingresar a tu
                cuenta para buscar trabadores cercanos!
              </span>
              <button
                className={classes.howToButton}
                onClick={() => {
                  setOpenInfoModal(true);
                }}
              >
                Habilita la ubicacion
              </button>
              <p style={{ fontWeight: "400", color: colors.textSecondary }}>
                o
              </p>
              <button
                className={classes.registerButton}
                onClick={() => navigate("/register")}
              >
                <MDBIcon
                  style={{ color: colors.primary }}
                  fab
                  icon="google"
                ></MDBIcon>
                <p style={{ color: colors.primary, fontWeight: "600" }}>
                  ¡Registrate!
                </p>
              </button>
            </div>
          ) : (
            <button
              className={classes.searchButton}
              onClick={() => {
                if (actualImportance === "" || actualWorkerCategory === "") {
                  toast.error("Seleccione todos los parametros!");
                } else if (
                  !auth?.accessToken &&
                  (!geoLocation?.latitude || !geoLocation?.longitude)
                ) {
                  getGeoLocationForSearch();
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
          )}
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
    fontWeight: "400",
    fontSize: "1rem",
    textAlign: "center",
    color: colors.textSecondary,
  },
  inputText: {
    width: "20rem",
    height: "6rem",
    padding: "10px",
    outline: "none",
    border: "none",
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: "10px",
    border: "solid 1px",
    borderColor: colors.secondary,
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
  infoLocationContainer: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  howToButton: {
    width: "10rem",
    height: "2rem",
    border: "none",
    fontWeight: "400",
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    textShadow: "0 0 white 10px",

    transition: "color 0.2s",

    "&:hover": {
      color: colors.white,
      textShadow: "0 0 white 20px",
    },
  },
  registerButton: {
    display: "flex",
    width: "15rem",
    height: "2rem",
    borderRadius: "20px",
    boxShadow: "0 0 10px black",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: colors.textSecondary,

    transition: "background 0.4s",

    "&:hover": {
      backgroundColor: colors.white,
    },
  },
});
