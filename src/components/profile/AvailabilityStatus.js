import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { colors } from "../../assets/colors";
import { createUseStyles } from "react-jss";
import RadioSelection from "../home/RadioSelection/RadioSelection";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

export default function AvailbilityStatus(props) {
  const { availability } = props;
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [actualAvailability, setActualAvailability] = useState("");
  const [value, setValue] = useState("");

  const classes = useStyles();

  useEffect(() => {
    setActualAvailability(availability);
  }, [availability]);

  const [selectionItemsArray, setSelectionItemsArray] = useState([
    { id: 1, itemName: "Disponible", itemCode: "AVAILABLE" },
    { id: 2, itemName: "Moderado", itemCode: "MODERATED" },
    { id: 3, itemName: "No Disponible", itemCode: "NOT_AVAILABLE" },
  ]);

  const handleChangeAvailability = () => {
    let updateBody = {
      availabilityStatus: value,
    };

    toast.promise(
      axiosPrivate.post(
        "/profile/update/" + auth?.role,
        JSON.stringify(updateBody)
      ),
      {
        loading: "Actualizando disponibilidad...",
        success: (response) => {
          setActualAvailability(value);
          setValue("");
          return <b>Se actualizo tu disponibilidad!</b>;
        },
        error: (error) => {
          return <span>Ocurrio un error al actualizar tu disponibilidad!</span>;
        },
      }
    );
  };

  return (
    <div className={classes.statusSelectionContainer}>
      <span style={{ color: colors.textSecondary, fontWeight: "700" }}>
        ¿Quieres cambiar tu grado de disponibilidad hoy?
      </span>
      <span style={{ color: colors.textSecondary }}>
        Actualmente tu disponibilidad es{" "}
        <b>
          {actualAvailability === "MODERATED"
            ? "Moderado"
            : actualAvailability === "AVAILABLE"
            ? "Disponible"
            : "No Disponible"}
        </b>
      </span>
      <RadioSelection
        selectionItemsArray={selectionItemsArray}
        onSelect={(newAvailability) => {
          setValue(newAvailability);
        }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button style={{}} onClick={() => handleChangeAvailability()}>
          Cambiar disponibilidad
        </button>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  statusSelectionContainer: {
    width: "50%",
    minHeight: "15rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    gap: "1rem",
  },
});
