import { createUseStyles } from "react-jss";
import Nav from "../pagewrappers/Nav";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import RadioSelection from "../home/RadioSelection/RadioSelection";
import { getProfile } from "../../connection/requests";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AttributeItem from "./AttributeItem";
import AddressSelection from "../auth/AddressSelection";
import AddressAttributeItem from "./AddressAttributeItem";

export default function Profile() {
  const axiosPrivate = useAxiosPrivate();
  const { auth, logOutAuth } = useAuth();
  const classes = useStyles();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Disponible", itemCode: "AVAILABLE" },
    { id: 2, itemName: "Moderado", itemCode: "MODERATED" },
    { id: 3, itemName: "No Disponible", itemCode: "NOT_AVAILABLE" },
  ]);

  useEffect(() => {
    if (auth?.accessToken) initializeUser();
    else navigate("/login", { state: { from: "/profile" } });
  }, []);

  const initializeUser = async () => {
    try {
      const response = await axiosPrivate.get("/profile/user", {});
      setUserData(response.data);
    } catch (err) {
      if (err?.response?.status === 401)
        navigate("/login", { state: { from: "/profile" }, replace: true });
    }

    //initializeSelectionStatus(userData.status);
  };

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <span
            style={{
              fontWeight: "700",
              width: "100%",
              fontSize: "4rem",
              color: colors.secondary,
              textAlign: "start",
            }}
          >
            PERFIL
          </span>
        </div>
        <div className={classes.subContainer}>
          <div className={classes.topSection}>
            <span
              style={{
                fontWeight: "800",
                color: colors.secondary,
                fontSize: "1.7rem",
              }}
            >
              Mis datos
            </span>
          </div>
          <div className={classes.bodySection}>
            <div className={classes.attributeItemContainer}>
              <img className={classes.userImage} src={userData.picture}></img>
            </div>
            <div className={classes.attributeItemContainer}>
              <AttributeItem
                inputData={{
                  id: 1,
                  name: "name",
                  type: "text",
                  placeholder: "Tu nombre",
                  errorMessage: "It should be a valid email address!",
                  label: "Nombre",
                }}
                actualValue={userData?.name}
              />
            </div>

            <div className={classes.attributeItemContainer}>
              <AttributeItem
                inputData={{
                  id: 2,
                  name: "phoneNumber",
                  type: "text",
                  placeholder: "Nuevo numero de telefono",
                  errorMessage: "It should be a valid email address!",
                  label: "Telefono",
                }}
                actualValue={userData?.phoneNumber}
              />
            </div>

            <div className={classes.attributeItemContainer}>
              <AttributeItem
                inputData={{
                  id: 3,
                  name: "password",
                  type: "text",
                  placeholder: "Nueva contraseña",
                  errorMessage: "It should be a valid email address!",
                  label: "Contraseña",
                }}
                actualValue={userData?.password}
              />
            </div>

            <div className={classes.attributeItemContainer}>
              <AttributeItem
                inputData={{
                  id: 4,
                  name: "birthDate",
                  type: "date",
                  label: "Fecha de Nacimiento",
                }}
                actualValue={userData?.birthDate}
              />
            </div>

            <div className={classes.attributeItemContainer}>
              <AddressAttributeItem
                actualValue={userData?.address}
                inputData={{
                  id: 5,
                  name: "address",
                  type: "text",
                  placeholder: "Nueva direccion",

                  label: "Direccion",
                }}
              />
            </div>

            {auth.role === "WORKER" ? (
              <>
                <div className={classes.attributeItemContainer}>
                  <AttributeItem
                    inputData={{
                      id: 6,
                      name: "workingHours",
                      type: "text",
                      placeholder: "Nuevo horario laboral",
                      label: "Horario Laboral",
                    }}
                    actualValue={userData?.workingHours}
                  />
                </div>
                <div className={classes.attributeItemContainer}>
                  <AttributeItem
                    inputData={{
                      id: 7,
                      name: "description",
                      type: "text",
                      placeholder: "Nueva descripcion...",
                      label: "Descripcion",
                    }}
                    actualValue={userData?.description}
                  />
                </div>
                <div className={classes.statusSelectionContainer}>
                  <span style={{ color: colors.white }}>
                    ¿Quieres cambiar tu grado de disponibilidad hoy?
                  </span>
                  <span>
                    Actualmente tu disponibilidad es{" "}
                    <b>
                      {userData.availabilityStatus === "MODERATED"
                        ? "Moderado"
                        : userData.availabilityStatus === "AVAILABLE"
                        ? "Disponible"
                        : "No Disponible"}
                    </b>
                  </span>
                  <RadioSelection
                    selectionItemsArray={selectionItemsArray}
                    onSelect={() => {}}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
            <button
              onClick={() => {
                logOutAuth();
              }}
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "200vh",
    paddingTop: "12rem",
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    fontFamily: "Montserrat",
  },
  leftContainer: {
    width: "25%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    paddingLeft: "2rem",
    justifyContent: "flex-start",
    borderRight: "solid 1px " + colors.secondary,
  },
  subContainer: {
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
  topSection: {
    width: "80%",
    height: "5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
    gap: "1rem",
    padding: "2rem",
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
    alignItems: "start",
    padding: "2rem",
  },
  statusSelectionContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: "1rem",
  },
  attributeItemContainer: {
    width: "70%",
  },
});
