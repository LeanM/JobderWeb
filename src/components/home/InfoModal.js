import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import Modal from "@mui/material/Modal";
import AddressSelection from "../auth/AddressSelection";
import { useState } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";
import { MDBIcon } from "mdb-react-ui-kit";

export default function InfoModal(props) {
  const { open } = props;
  const { getAddressSugestions, setGeoLocation } = useGeoLocation();
  const classes = useStyles();
  const [addressSugestions, setAddressSugestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const onChange = (e) => {
    setAddressSugestions([]);
    setIsSearching(true);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      getAddressSugestions(e.target.value).then((response) => {
        setAddressSugestions(response);
        setIsSearching(false);
      });
    }, 2000);

    setDebounceTimer(timer);
  };

  const onSelectAddress = (address) => {
    setGeoLocation({
      latitude: address?.lat,
      longitude: address?.lon,
    });
    props.onChooseAddress();
  };

  return (
    <Modal open={open} onClose={props.onClose}>
      <div className={classes.container}>
        <button
          className={classes.upperCloseButton}
          onClick={() => props.onReady()}
        >
          X
        </button>
        <div className={classes.header}>
          <div className={classes.headerLine}></div>
          <span className={classes.title}>COMO</span>
          <span className={classes.subTitle}>Habilitar Ubicacion</span>
        </div>

        <div className={classes.body}>
          <div className={classes.stepsContainer}>
            <span>
              1. Busca en la barra de tu navegador el icono{" "}
              <MDBIcon icon="compass"></MDBIcon>
            </span>
            <span>2. Clickealo y permite la ubicacion para esta pagina</span>
            <span>3. Listo, puedes cerrar esta ventana</span>
            <span style={{ fontWeight: "700" }}>No lo encontraste?</span>
            <span style={{ textAlign: "center" }}>
              Ve a configuracion del navegador, luego a privacidad y seguridad,
              configuracion de sitios y ahi dentro habilita la ubicacion para
              Jobder.
            </span>
          </div>
          <div
            style={{
              height: "1px",
              width: "60%",
              backgroundColor: colors.secondary,
            }}
          ></div>
          <div className={classes.stepsContainer}>
            <span>
              Si no pudiste habilitar la ubicacion en el navegador, o tu
              navegador no posee esa capacidad:
            </span>
            <span>
              Escribe en que ciudad te encuentras y seleccionala en la lista de
              abajo
            </span>
            <input
              type="text"
              placeholder="Escribe tu ciudad"
              style={{
                backgroundColor: colors.textSecondary,
                width: "40%",
                height: "2rem",
                color: colors.primary,
                outline: "none",
                border: "none",
                borderBottom: `solid 1px ${colors.primary}`,
              }}
              onChange={onChange}
            ></input>
            <div style={{ width: "60%", height: "7rem" }}>
              <AddressSelection
                isSearching={isSearching}
                onSelectAddress={(address) => onSelectAddress(address)}
                addressSugestions={addressSugestions}
              />
            </div>
          </div>
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottomInner}>
            <button
              className={classes.closeButton}
              onClick={() => props.onReady()}
            >
              ¡Listo!
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    width: "60%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: colors.textSecondary,
    backgroundSize: "cover",
    border: `solid 1px ${colors.primary}`,
    borderRadius: "5px",
    boxShadow: "0 0 5px black",
    fontFamily: "Montserrat",

    "@media screen and (max-width: 800px)": {
      width: "95%",
    },
  },
  background: {
    position: "absolute",
    backgroundSize: "cover",

    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 0.2,
  },
  header: {
    width: "100%",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "2rem",
  },
  headerLine: {
    width: "1px",
    height: "3rem",
    backgroundColor: colors.primary,
    marginBottom: "1rem",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "700",
    color: colors.primary,
    lineHeight: "4.5rem",
  },
  subTitle: {
    fontSize: "1rem",
    fontWeight: "300",
    color: colors.primary,
  },
  stepsContainer: {
    display: "flex",
    width: "80%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    color: colors.primaryDark,
    gap: "0.3rem",
  },
  body: {
    width: "100%",
    height: "60%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
  },

  bottom: {
    width: "100%",
    height: "8%",
    backgroundColor: colors.primary,
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  bottomInner: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  upperCloseButton: {
    right: "10px",
    top: "10px",
    position: "absolute",
    fontWeight: "700",
    backgroundColor: colors.textSecondary,
    color: colors.primary,
    borderRadius: "100%",
    border: `solid 1px ${colors.secondary}`,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      backgroundColor: colors.primary,
      color: colors.white,
    },
  },
  closeButton: {
    width: "8rem",
    height: "3rem",
    border: `solid 1px ${colors.secondary}`,
    borderRadius: "20px",
    backgroundColor: colors.primary,
    color: colors.textSecondary,

    transition: "background 0.5s, border 0.5s",

    "&:hover": {
      color: colors.primary,
      backgroundColor: colors.textSecondary,
    },
  },
});
