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
          className={classes.dataItem}
          style={{
            fontWeight: "800",
            fontSize: "1.7rem",
            marginBottom: "1rem",
          }}
        >
          {workerData.worker.name}
        </span>
        <div className={classes.dataItem}>
          <div className={classes.dataItemIconContainer}>
            <MDBIcon icon="info" style={{}}></MDBIcon>
          </div>
          <span className={classes.dataItemTextContainer}>
            {workerData.distanceInKm}Km de distancia
          </span>
        </div>
        <div className={classes.dataItem}>
          <div className={classes.dataItemIconContainer}>
            <MDBIcon style={{ color: "yellow" }} icon="star"></MDBIcon>
          </div>
          <span className={classes.dataItemTextContainer}>
            {workerData.worker.averageRating}
          </span>
        </div>
        <div className={classes.dataItem}>
          <div className={classes.dataItemIconContainer}>
            <MDBIcon style={{ color: "orange" }} icon="medal"></MDBIcon>
          </div>
          <span className={classes.dataItemTextContainer}>
            {workerData.worker.worksFinished}+ trabajos realizados
          </span>
        </div>
        <div className={classes.statusContainer}>
          {workerData.worker.availabilityStatus === "AVAILABLE" ? (
            <>
              <div
                className={classes.statusIcon}
                style={{ backgroundColor: colors.price }}
              ></div>
              <span className={classes.statusText}>Hoy disponible!</span>
            </>
          ) : workerData.worker.availabilityStatus === "MODERATED" ? (
            <>
              <div
                className={classes.statusIcon}
                style={{ backgroundColor: "orange" }}
              ></div>
              <span className={classes.statusText}>Algo ocupado!</span>
            </>
          ) : (
            <>
              <div
                className={classes.statusIcon}
                style={{ backgroundColor: colors.notification }}
              ></div>
              <span className={classes.statusText}>Hoy no disponible!</span>
            </>
          )}
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
  dataItem: {
    color: colors.white,
    width: "100%",
    paddingLeft: "1.5rem",
    fontWeight: "100",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dataItemIconContainer: {
    width: "7%",
    height: "100%",
    textAlign: "center",
  },
  dataItemTextContainer: {
    height: "100%",
    width: "90%",
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
