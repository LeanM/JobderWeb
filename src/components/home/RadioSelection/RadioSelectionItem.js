import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";

export default function RadioSelectionItem(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { actualSelection, itemData } = props;
  const classes = useStyles();
  const [itemStyle, setItemStyle] = useState({});

  const selectedItemStyle = {
    border: "1px solid " + colors.white,
  };

  const nonSelectedItemStyle = {
    border: "solid 1px " + colors.transparent,
  };

  useEffect(() => {
    if (actualSelection === itemData.id) setItemStyle(selectedItemStyle);
    else setItemStyle(nonSelectedItemStyle);
  }, [actualSelection]);

  return (
    <div
      className={classes.selectionItemContainer}
      style={itemStyle}
      onClick={() => props.onSelect(itemData.id, itemData.itemCode)}
    >
      <span className={classes.selectionItemText}>{itemData.itemName}</span>
    </div>
  );
}

const useStyles = createUseStyles({
  selectionItemContainer: {
    height: "80%",
    width: "10rem",
    backgroundColor: colors.secondary,
    cursor: "pointer",
    color: colors.primary,
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 0.5s , colors 0.5s , border 0.5s",

    "&:hover": {
      backgroundColor: colors.hover,
      color: colors.textSecondary,
    },
  },
  selectionItemText: {
    textAlign: "center",
  },
});
