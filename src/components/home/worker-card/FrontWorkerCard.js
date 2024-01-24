import { createUseStyles } from "react-jss";
import { MDBIcon } from "mdb-react-ui-kit";
import { colors } from "../../../assets/colors";

export default function FrontWorkerCard(props) {
  const { workerData } = props;
  const classes = useStyles();
  return (
    <div className={classes.frontContainer}>
      <div className={classes.imageContainer}>
        <img className={classes.image} src="./worker.jpg"></img>
      </div>
      <div className={classes.dataContainer}>
        <span
          className={classes.dataText}
          style={{ fontWeight: "800", fontSize: "2rem" }}
        >
          {workerData.nombre}
        </span>
        <div className={classes.dataText}>
          <MDBIcon icon="info" style={{}}></MDBIcon>
          <p>{workerData.distancia}Km de distancia</p>
        </div>
        <div className={classes.dataText}>
          <MDBIcon style={{ color: "yellow" }} icon="star"></MDBIcon>
          <p>{workerData.rating}</p>
        </div>
        <div className={classes.dataText}>
          <MDBIcon style={{ color: "orange" }} icon="medal"></MDBIcon>
          <p>100+ trabajos realizados</p>
        </div>
        <div className={classes.statusContainer}>
          <div
            className={classes.statusIcon}
            style={{ backgroundColor: colors.price }}
          ></div>
          <span className={classes.statusText}>Activo</span>
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  frontContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  imageContainer: {
    width: "95%",
    height: "60%",
    padding: "10px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  },
  dataContainer: {
    width: "100%",
    height: "40%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "start",
    paddingLeft: "0",
    flexDirection: "column",
    gap: "0.2rem",
  },
  dataText: {
    color: colors.white,
    marginLeft: "1.5rem",
    fontWeight: "100",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  statusContainer: {
    width: "100%",
    height: "2rem",
    display: "flex",
    marginTop: "auto",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.3rem",
  },
  statusIcon: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "100em",
  },
  statusText: {
    color: colors.white,
  },
});
