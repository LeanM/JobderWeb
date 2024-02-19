import { createUseStyles } from "react-jss";
import React, { useEffect, useRef, useState } from "react";
import FormInput from "./FormInput";
import ProgressBar from "@ramonak/react-progress-bar";
import Nav from "../pagewrappers/Nav";
import { colors } from "../../assets/colors";
import useGeoLocation from "../../hooks/useGeoLocation";
import AddressSelection from "./AddressSelection";

export default function WorkerRegistration() {
  const formRef = useRef(null);
  const { geoLocation, getAddressSugestions, setGeoLocation } =
    useGeoLocation();
  const [completion, setCompletion] = useState(0);
  const [addressSuggestions, setAddressSugestions] = useState([]);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    date: "",
    phone: "",
    description: "",
    workingHours: "",
    address: "",
    latitude: 0,
    longitude: 0,
    accountRole: "WORKER",
    workSpecialization: "",
  });
  const classes = useStyles();
  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      placeholder: "Tu nombre",
      errorMessage:
        "Your name should be 3-16 characters and shouldn't include any special character!",
      label: "Nombre",
      pattern: "/^[a-z ,.'-]+$/i",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Tu email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "date",
      type: "date",
      placeholder: "Tu fecha de nacimiento",
      label: "Fecha de nacimiento",
      required: true,
    },

    {
      id: 4,
      name: "phone",
      type: "text",
      placeholder: "Tu numero de telefono",
      label: "Numero de telefono",
      required: true,
    },
    {
      id: 5,
      name: "description",
      type: "text",
      placeholder: "Describete como trabajador...",
      label: "Describete",
      required: true,
    },
    {
      id: 6,
      name: "workingHours",
      type: "text",
      placeholder: "8AM - 16PM / A toda hora / Otro",
      label: "Horario Laboral",
      required: true,
    },
    {
      id: 7,
      name: "address",
      type: "text",
      placeholder: "Ej. Direccion, Ciudad, Provincia",
      label: "Tu Direccion",
      required: true,
    },
    {
      id: 8,
      name: "password",
      type: "text",
      placeholder: "Elije una contraseña segura",
      errorMessage:
        "Your name should be 3-16 characters and shouldn't include any special character!",
      label: "Contraseña",
      pattern: "/^[a-z ,.'-]+$/i",
      required: true,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [debounceTimer, setDebounceTimer] = useState(null);

  const onSuggestAddress = (e) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      getAddressSugestions(e.target.value).then((response) =>
        setAddressSugestions(response)
      );
    }, 3000);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    verifyStep();
  }, [values]);

  const verifyStep = () => {
    let newCompletion = 0;
    let eachCompletion = Math.ceil(100 / 7);

    if (values.name !== "") newCompletion += eachCompletion;
    if (values.email !== "") newCompletion += eachCompletion;
    if (values.date !== "") newCompletion += eachCompletion;
    if (values.phone !== "") newCompletion += eachCompletion;
    if (values.description !== "") newCompletion += eachCompletion;
    if (values.workingHours !== "") newCompletion += eachCompletion;
    if (
      values.address !== "" &&
      values.latitude !== 0 &&
      values.longitude !== 0
    )
      newCompletion += eachCompletion;

    if (newCompletion > 100) newCompletion = 100;

    setCompletion(newCompletion);
  };

  return (
    <>
      <Nav />
      <div className={classes.container}>
        <div
          className={classes.subContainer}
          style={{
            backgroundImage: `url(./images/contactImage.webp)`,
            backgroundSize: "cover",
          }}
        >
          <div className={classes.dataContainer}>
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1 className={classes.title}>Registro de Trabajador</h1>
            </div>
            <form
              className={classes.form}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className={classes.inputsRow}>
                <div className={classes.inputsContainer}>
                  <FormInput
                    key={inputs[0].id}
                    {...inputs[0]}
                    value={values[inputs[0]]}
                    onChange={onChange}
                  />
                  <FormInput
                    key={inputs[1].id}
                    {...inputs[1]}
                    value={values[inputs[1]]}
                    onChange={onChange}
                  />
                  <FormInput
                    key={inputs[7].id}
                    {...inputs[7]}
                    value={values[inputs[7]]}
                    onChange={onChange}
                  />
                  <FormInput
                    key={inputs[2].id}
                    {...inputs[2]}
                    value={values[inputs[2]]}
                    onChange={onChange}
                  />
                </div>
                <div className={classes.inputsContainer}>
                  <FormInput
                    key={inputs[3].id}
                    {...inputs[3]}
                    value={values[inputs[3]]}
                    onChange={onChange}
                  />

                  <FormInput
                    key={inputs[4].id}
                    {...inputs[4]}
                    value={values[inputs[4]]}
                    onChange={onChange}
                  />
                  <FormInput
                    key={inputs[5].id}
                    {...inputs[5]}
                    value={values[inputs[5]]}
                    onChange={onChange}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <FormInput
                    key={inputs[6].id}
                    {...inputs[6]}
                    value={values[inputs[6]]}
                    onChange={onSuggestAddress}
                  />
                </div>
              </div>

              <button className={classes.submitButton}>Enviar</button>
            </form>
          </div>
          <div className={classes.infoContainer}>
            <div className={classes.interestMenusContainter}>
              <span style={{ color: colors.textSecondary }}>
                Selecciona tu direccion!
              </span>
              <AddressSelection
                onSelectAddress={(address) => {
                  setValues((prev) => ({
                    ...prev,
                    address: address?.display_name,
                    longitude: address?.lon,
                    latitude: address?.lat,
                  }));
                }}
                addressSugestions={addressSuggestions}
              />
            </div>
            <div className={classes.progessContainer}>
              <p style={{ fontWeight: "400", color: colors.textSecondary }}>
                Completitud de informacion requerida
              </p>
              <ProgressBar
                className={classes.progressBar}
                bgColor={colors.textSecondary}
                baseBgColor={colors.primary}
                height="0.5rem"
                labelColor={colors.textSecondary}
                completed={completion}
                maxCompleted={100}
                transitionDuration="0.5s"
              />
              <p style={{ fontWeight: "800", color: colors.textSecondary }}>
                {completion}%
              </p>
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
    height: "160vh",
    backgroundColor: colors.primary,
    //background: `linear-gradient(${colors.navSecondary},${colors.textNav})`,
    display: "flex",
    fontFamily: "Poppins",
    justifyContent: "center",
    alignItems: "start",
    paddingTop: "10rem",

    "@media screen and (max-width: 900px)": {
      height: "250vh",
    },
  },
  subContainer: {
    width: "95%",
    height: "85%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    "@media screen and (max-width: 1000px)": {
      width: "100%",
    },

    "@media screen and (max-width: 900px)": {
      flexDirection: "column",
      height: "95%",
    },
  },
  dataContainer: {
    width: "65%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white,
    boxShadow: "0 0 2px black",

    alignItems: "center",

    "@media screen and (max-width: 900px)": {
      height: "65%",
      width: "70%",
      borderRadius: "20px 20px 0px 0px",
    },

    "@media screen and (max-width: 600px)": {
      width: "90%",
    },
  },
  infoContainer: {
    width: "30%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "0 20px 20px 0",
    alignItems: "center",
    backgroundColor: colors.secondary,
    gap: "2rem",

    "@media screen and (max-width: 900px)": {
      height: "30%",
      width: "70%",
      flexDirection: "column-reverse",
      borderRadius: "0px 0 20px 20px",
    },

    "@media screen and (max-width: 600px)": {
      width: "90%",
    },
  },
  title: {
    color: colors.primary,
    fontSize: "3rem",
    marginTop: "3rem",
    fontWeight: "800",

    "@media screen and (max-width: 450px)": {
      fontSize: "2.5rem",
    },
  },
  form: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  inputsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    height: "80%",
    gap: "0.2rem",

    "@media screen and (max-width: 900px)": {
      flexDirection: "column",
      flexWrap: "nowrap",
    },
  },
  inputsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "45%",
    height: "70%",
    gap: "0.2rem",

    "@media screen and (max-width: 900px)": {
      width: "80%",
      height: "50%",
    },

    "@media screen and (max-width: 450px)": {
      width: "95%",
    },
  },
  interestMenusContainter: {
    width: "95%",
    height: "20rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",

    "@media screen and (max-width: 900px)": {
      height: "12rem",
    },
  },
  submitButton: {
    width: "8rem",
    height: "3rem",
    borderRadius: "20px",
    fontWeight: "400",

    border: `solid 1px ${colors.secondary}`,

    backgroundColor: colors.primary,
    color: colors.textSecondary,

    transition: "background 0.3s, color 0.3s",

    "&:hover": {
      backgroundColor: colors.textSecondary,
      color: colors.primary,
    },
  },
  progessContainer: {
    width: "80%",
    height: "5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "1rem",

    "@media screen and (max-width: 900px)": {
      gap: "0.5rem",
      height: "4rem",
    },
  },
  progressBar: {
    width: "70%",
    height: "100%",

    "@media screen and (max-width: 800px)": {
      width: "90%",
    },
  },
});
