import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import AddressSelection from "../auth/AddressSelection";
import { colors } from "../../assets/colors";
import { MDBIcon } from "mdb-react-ui-kit";
import AttributeInput from "./AtribbuteInput";
import useGeoLocation from "../../hooks/useGeoLocation";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function AddressAttributeItem(props) {
  const { geoLocation, getAddressSugestions, setGeoLocation } =
    useGeoLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState({});
  const [actualValueShow, setActualValueShow] = useState("");
  const [addressSugestions, setAddressSugestions] = useState([]);
  const [canEdit, setCanEdit] = useState(false);

  const { actualValue, inputData } = props;

  const classes = useStyles();

  useEffect(() => {
    setActualValueShow(actualValue);
  }, [actualValue]);

  const [debounceTimer, setDebounceTimer] = useState(null);

  const onChange = (e) => {
    setAddressSugestions([]);
    setIsSearching(true);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      getAddressSugestions(e.target.value).then((response) => {
        setAddressSugestions(response);
        setIsSearching(false);
      });
    }, 3000);

    setDebounceTimer(timer);
  };

  const sendUpdate = async () => {
    let updateBody = {
      longitude: value.longitude,
      latitude: value.latitude,
      address: value.address,
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
          setActualValueShow(value.address);
          setValue({});
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
          <AttributeInput
            {...inputData}
            value={value?.address}
            onChange={onChange}
          />
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
      <div className={classes.addressSelectionContainer}>
        <AddressSelection
          isSearching={isSearching}
          onSelectAddress={(address) => {
            setValue({
              address: address?.display_name,
              longitude: address?.lon,
              latitude: address?.lat,
            });
          }}
          addressSugestions={addressSugestions}
        />
      </div>
    </div>
  ) : (
    <div className={classes.closedContainer}>
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
            <span
              style={{
                color: colors.textSecondary,
                width: "80%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                textAlign: "left",
              }}
            >
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "2rem",
  },
  closedContainer: {
    width: "100%",
    height: "4rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subContainer: {
    width: "100%",
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
  addressSelectionContainer: {
    width: "70%",
    height: "20rem",
    display: "flex",
    justifyContent: "center",
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
