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
import PasswordModal from "./PasswordModal";
import Avatar from "react-avatar";
import AvailbilityStatus from "./AvailabilityStatus";

export default function Profile() {
  const axiosPrivate = useAxiosPrivate();
  const { auth, logOutAuth } = useAuth();
  const classes = useStyles();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

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
      <PasswordModal
        open={openPasswordModal}
        isGoogleUser={userData.isGoogleUser}
        onClose={() => setOpenPasswordModal(false)}
      />
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <div className={classes.leftTopSection}>
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
          <div className={classes.leftBodySection}>
            <button
              onClick={() => {
                logOutAuth();
              }}
              className={classes.logoutButton}
            >
              Cerrar Sesion
            </button>
          </div>
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
            <div className={classes.attributePictureContainer}>
              {!userData?.picture ? (
                <div className={classes.userImageContainer}>
                  <Avatar
                    size="100%"
                    name={userData?.name}
                    maxInitials={2}
                    round={true}
                  />
                </div>
              ) : (
                <div className={classes.userImageContainer}>
                  <img
                    className={classes.userImage}
                    src={userData.picture}
                  ></img>
                </div>
              )}
              <input style={{}} type="file" name="myImage" />
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
                <AvailbilityStatus
                  availability={userData?.availabilityStatus}
                />
              </>
            ) : (
              <></>
            )}
            <div className={classes.attributeItemContainer}>
              <button
                style={{
                  fontWeight: "400",
                  width: "15rem",
                  height: "2rem",
                  fontSize: "1rem",
                  color: colors.notificationLight,
                  backgroundColor: colors.primary,
                  border: "solid 1px " + colors.notificationLight,
                  borderRadius: "10px",
                }}
                onClick={() => setOpenPasswordModal(true)}
              >
                Cambiar Contraseña
              </button>
            </div>
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
  leftTopSection: {
    width: "100%",
    height: "15rem",
  },
  leftBodySection: {
    width: "100%",
    minHeight: "10rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
  logoutButton: {
    width: "10rem",
    height: "2rem",
    borderRadius: "10px",
    backgroundColor: colors.notificationLight,
    color: colors.primary,

    transition: "background 0.3s",

    "&:hover": {
      backgroundColor: colors.notification,
    },
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
    width: "90%",
    height: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
    gap: "1rem",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  userImageContainer: {
    width: "7rem",
    height: "7rem",
    borderRadius: "100%",
    border: "solid 2px " + colors.secondary,
  },
  userImage: {
    borderRadius: "100%",
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  bodySection: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
  attributeItemContainer: {
    width: "70%",
    display: "flex",
    minHeight: "4rem",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  attributePictureContainer: {
    width: "70%",
    display: "flex",
    minHeight: "10rem",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
