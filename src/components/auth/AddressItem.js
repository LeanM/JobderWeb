import { createUseStyles } from "react-jss";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { colors } from "../../assets/colors";

export default function AddressItem(props) {
  const classes = useStyles();
  const { addressData, selectedAddress } = props;
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (selectedAddress === addressData?.place_id) {
      setStyle({ borderColor: colors.white });
    } else setStyle({ borderColor: colors.transparent });
  }, [selectedAddress]);

  return (
    <div
      className={classes.itemContainer}
      onClick={() => {
        props.onSelect(addressData);
      }}
    >
      <div style={style} className={classes.item}>
        <p className={classes.itemText}>{addressData?.display_name}</p>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  itemContainer: {
    width: "100%",
    minHeight: "4rem",
    display: "flex",
    padding: "5px",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "0.7rem",
    fontWeight: "200",
    borderRadius: "5px",
    backgroundColor: colors.primary,
  },
  item: {
    width: "90%",
    minHeight: "3rem",
    display: "flex",
    padding: "5px",
    justifyContent: "flex-start",
    alignItems: "center",
    border: "solid 1px " + colors.transparent,
    borderRadius: "5px",

    backgroundColor: colors.primary,
    color: colors.white,
    gap: "1rem",

    transition: "background 0.5s, color 0.5s, border 0.5s",

    "&:hover": {
      backgroundColor: colors.secondary,
    },
  },

  itemText: {
    textAlign: "start",
    fontSize: "0.7rem",
    "@media screen and (max-width: 700px)": {
      fontSize: "0.7rem",
    },
  },
});
