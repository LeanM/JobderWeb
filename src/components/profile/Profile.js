import { createUseStyles } from "react-jss";
import Nav from "../pagewrappers/Nav";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import RadioSelection from "../home/RadioSelection/RadioSelection";

export default function Profile() {
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Disponible", itemCode: "available" },
    { id: 2, itemName: "Moderado", itemCode: "moderated" },
    { id: 3, itemName: "No Disponible", itemCode: "notavailable" },
  ]);

  useEffect(() => {
    setUserData({
      role: "worker",
      name: "Leandro Moran",
      phoneNumber: "29312931",
      status: "moderated",
    });
  }, []);
  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.topSection}>
            <img className={classes.userImage} src="./worker.jpg"></img>
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
            {userData.role === "worker" ? (
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
