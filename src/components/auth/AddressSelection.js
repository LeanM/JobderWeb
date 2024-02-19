import { createUseStyles } from "react-jss";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { colors } from "../../assets/colors";
import AddressItem from "./AddressItem";

export default function AddressSelection(props) {
  const classes = useStyles();
  const { addressSugestions } = props;
  const [selectedAddress, setSelectedAddress] = useState("");

  return (
    <div className={classes.container}>
      {addressSugestions.length > 0 ? (
        addressSugestions.map((address) => {
          return (
            <AddressItem
              key={address?.place_id}
              selectedAddress={selectedAddress}
              onSelect={(address) => {
                setSelectedAddress(address?.place_id);
                props.onSelectAddress(address);
              }}
              addressData={address}
            />
          );
        })
      ) : (
        <span style={{ color: colors.textSecondary, textAlign: "center" }}>
          Escribe tu direccion en el formulario!
        </span>
      )}
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "90%",
    height: "100%",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.primary,
    overflowY: "scroll",
    overflowX: "hidden",
    padding: "10px",
    fontFamily: "Poppins",
    gap: "0.5rem",
  },
});
