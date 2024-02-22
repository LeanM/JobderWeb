import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";

export default function TabSelectionItem(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { actualSelection, itemData } = props;
  const classes = useStyles();
  const [itemStyle, setItemStyle] = useState({});

  const selectedItemStyle = {
    borderBottom: "1px solid " + colors.white,
  };

  const nonSelectedItemStyle = {};

  useEffect(() => {
    if (actualSelection === itemData.id) setItemStyle(selectedItemStyle);
    else setItemStyle(nonSelectedItemStyle);
  }, [actualSelection]);

  return (
    <button
      className={classes.selectionItemContainer}
      style={itemStyle}
      onClick={() => props.onSelect(itemData.id, itemData.itemCode)}
    >
      <span className={classes.selectionItemText}>{itemData.itemName}</span>
    </button>
  );
}

const useStyles = createUseStyles({
  selectionItemContainer: {
    height: "100%",
    flexGrow: 1,
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: `1px solid ${colors.secondary}`,
    transition: "background 0.5s , colors 0.5s , border 0.5s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },
  },
  selectionItemText: {
    textAlign: "center",
  },
});
