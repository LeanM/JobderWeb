import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import ReactCardFlip from "react-card-flip";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { MDBIcon } from "mdb-react-ui-kit";

export default function WorkerCard(props) {
  const { auth } = useAuth();
  const { workerData } = props;
  const classes = useStyles();
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
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
        <div className={classes.frontContainer}>
          <div className={classes.imageContainer}>
            <img className={classes.image} src="./logo512.png"></img>
          </div>
          <div className={classes.dataContainer}>{workerData.nombre}</div>
        </div>
        <div className={classes.backContainer}>
          <div className={classes.backInfoContainer}></div>
          <div className={classes.buttonContainer}>
            {auth?.accessToken ? (
              <Button>Comunicarme!</Button>
            ) : (
              <Button className={classes.loginButton}>
                Inicia sesion!
                <MDBIcon icon="info"></MDBIcon>
              </Button>
            )}
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "15rem",
    height: "20rem",

    borderRadius: "10px",
  },
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
    height: "50%",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dataContainer: {
    width: "100%",
    height: "50%",
  },
  backContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.textSecondary,
    borderRadius: "10px",
  },
  backInfoContainer: {
    height: "70%",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    height: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: { color: "red" },
});
