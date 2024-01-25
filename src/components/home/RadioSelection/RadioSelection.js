import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import RadioSelectionItem from "./RadioSelectionItem";

export default function RadioSelection(props) {
  const [actualSelectionId, setActualSelectionId] = useState(0);
  const classes = useStyles();
  const { selectionItemsArray } = props;

  const onSelectItem = (selectedItemId, selectedItemName) => {
    setActualSelectionId(selectedItemId);
    props.onSelect(selectedItemName);
  };

  return (
    <div className={classes.container}>
      {selectionItemsArray.map((item) => {
        return (
          <RadioSelectionItem
            actualSelection={actualSelectionId}
            itemData={item}
            onSelect={(id, name) => onSelectItem(id, name)}
          />
        );
      })}
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.5rem",
  },
});
