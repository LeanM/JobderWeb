import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import Reveal from "../animations/Reveal";

export default function ChatView(props) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.backContainer}>
        <Button className={classes.backButton} onClick={() => navigate(-1)}>
          Volver atras!
        </Button>
      </div>
      <div className={classes.subContainer}>
        <Reveal
          animationVariant="left"
          styles={classes.workerBasicDataContainer}
        ></Reveal>
        <Reveal
          animationVariant="right"
          styles={classes.workerAdvancedDataContainer}
        >
          <div className={classes.dataContainer}></div>
          <div className={classes.reviewContainer}></div>
        </Reveal>
      </div>
      <div>
        {auth?.accessToken ? (
          <Button></Button>
        ) : (
          <Button className={classes.loginButton}>
            Inicia sesion!
            <MDBIcon icon="info"></MDBIcon>
          </Button>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: colors.primary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backContainer: {
    width: "100%",
    height: "5rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  backButton: {
    width: "10rem",
    height: "2.5rem",
    marginLeft: "3rem",
  },
  subContainer: {
    width: "90%",
    height: "70%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  workerBasicDataContainer: {
    width: "27%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  workerAdvancedDataContainer: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: "10px",
  },
  dataContainer: {
    width: "80%",
    height: "47%",
    backgroundColor: colors.primary,
  },
  reviewContainer: {
    width: "80%",
    height: "47%",
    backgroundColor: colors.primary,
  },
});
