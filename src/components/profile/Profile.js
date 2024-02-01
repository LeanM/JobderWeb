import { createUseStyles } from "react-jss";
import Nav from "../pagewrappers/Nav";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import RadioSelection from "../home/RadioSelection/RadioSelection";
import { getProfile } from "../../connection/requests";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { auth } = useAuth();
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Disponible", itemCode: "available" },
    { id: 2, itemName: "Moderado", itemCode: "moderated" },
    { id: 3, itemName: "No Disponible", itemCode: "notavailable" },
  ]);
  const [startSelection, setStartSelection] = useState(0);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    getProfile(auth?.accessToken)
      .then((response) => setUserData(response.data))
      .catch((error) => {
        console.log(error);
      });

    //initializeSelectionStatus(userData.status);
  };

  const initializeSelectionStatus = (status) => {
    if (status === "available") {
      setStartSelection(1);
    }
    if (status === "moderated") {
      setStartSelection(2);
    }
    if (status === "notavailable") {
      setStartSelection(3);
    }
  };

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.topSection}>
            <img className={classes.userImage} src={userData.picture}></img>
            <span
              style={{
                fontWeight: "800",
                color: colors.secondary,
                fontSize: "1.7rem",
              }}
            >
              {userData.name}
            </span>
          </div>
          <div className={classes.bodySection}>
            <span>{userData.email}</span>
            <span>{userData.phoneNumber}</span>
            {auth.role === "WORKER" ? (
              <div className={classes.statusSelectionContainer}>
                <span style={{ color: colors.white }}>
                  Cual es tu grado de disponibilidad hoy?
                </span>
                <RadioSelection
                  selectionItemsArray={selectionItemsArray}
                  onSelect={() => {}}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    paddingTop: "12rem",
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Montserrat",
  },
  subContainer: {
    width: "80%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "dlex-start",
    alignItems: "center",
  },
  topSection: {
    width: "100%",
    height: "40vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
  },
  userImage: {
    borderRadius: "100%",
    objectFit: "cover",
    border: "solid 2px " + colors.secondary,
    width: "10rem",
    height: "10rem",
  },
  bodySection: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  statusSelectionContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
});
