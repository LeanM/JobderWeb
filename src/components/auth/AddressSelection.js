import { createUseStyles } from "react-jss";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { colors } from "../../assets/colors";
import AddressItem from "./AddressItem";

export default function AddressSelection(props) {
  const classes = useStyles();
  const { addressSugestions, isSearching } = props;
  const [selectedAddress, setSelectedAddress] = useState("");

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
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
        ) : !isSearching ? (
          <span style={{ color: colors.textSecondary, textAlign: "center" }}>
            Escribe tu direccion en el formulario para ver resultados!
          </span>
        ) : (
          <span>Buscando...</span>
        )}
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  subContainer: {
    width: "95%",
    height: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.primary,
    alignItems: "start",
    overflowY: "scroll",
    overflowX: "hidden",
    fontFamily: "Montserrat",
    gap: "0.5rem",
  },
});
