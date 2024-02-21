import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import AttributeInput from "./AtribbuteInput";
import { colors } from "../../assets/colors";
import { MDBIcon } from "mdb-react-ui-kit";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

export default function AttributeItem(props) {
  const { inputData, actualValue } = props;
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [value, setValue] = useState("");
  const [actualValueShow, setActualValueShow] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setActualValueShow(actualValue);
  }, [actualValue]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const sendUpdate = async () => {
    let attribute = inputData.name;
    let updateBody = {
      [attribute]: value,
    };
    toast.promise(
      axiosPrivate.post(
        "/profile/update/" + auth?.role,
        JSON.stringify(updateBody)
      ),
      {
        loading: "Actualizando datos...",
        success: (response) => {
          setCanEdit(false);
          setActualValueShow(value);
          setValue("");
          return <b>Se actualizaron los datos correctamente!</b>;
        },
        error: (error) => {
          return <span>Ocurrio un error al actualizar el dato!</span>;
        },
      }
    );
  };

  return canEdit ? (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.attributeNameContainer}>
          <span
            style={{
              color: colors.textSecondary,
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            {inputData.label}
          </span>
        </div>
        <div className={classes.inputContainer}>
          <AttributeInput {...inputData} value={value} onChange={onChange} />
          <div className={classes.buttonsContainer}>
            <button
              className={classes.button}
              style={{ color: colors.price }}
              onClick={() => {
                sendUpdate();
              }}
            >
              <MDBIcon icon="check" />
            </button>
            <button
              className={classes.button}
              style={{ color: colors.notification }}
              onClick={() => setCanEdit(false)}
            >
              <MDBIcon icon="ban" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.attributeNameContainer}>
          <span
            style={{
              color: colors.textSecondary,
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            {inputData.label}
          </span>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.infoContainer}>
            <span style={{ color: colors.textSecondary }}>
              {actualValueShow}
            </span>
          </div>
          <div className={classes.buttonsContainer}>
            <button
              className={classes.button}
              style={{ color: colors.secondary }}
              onClick={() => setCanEdit(true)}
            >
              <MDBIcon icon="pen" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "4rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  infoContainer: {
    width: "80%",
    height: "100%",
    textAlign: "center",

    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: "1rem",
  },
  attributeNameContainer: {
    width: "30%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputContainer: {
    width: "70%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "20%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    width: "2rem",
    height: "2rem",
    backgroundColor: colors.primary,
    borderRadius: "100px",
    border: "solid 1px " + colors.secondary,
  },
});
