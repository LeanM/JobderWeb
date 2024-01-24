import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import RadioSelectionItem from "./RadioSelectionItem";

export default function RadioSelection(props) {
  const [actualSelectionId, setActualSelectionId] = useState(0);
  const [selectionItems, setSelectionItems] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fillSelectionItems();
  }, []);

  const fillSelectionItems = () => {
    let selectionItemsArray = [
      { id: 1, itemName: "Urgente" },
      { id: 2, itemName: "Moderado" },
      { id: 3, itemName: "Poco Urgente" },
    ];

    setSelectionItems(selectionItemsArray);
  };

  const onSelectItem = (selectedItemId, selectedItemName) => {
    setActualSelectionId(selectedItemId);
    props.onSelect(selectedItemName);
  };

  return (
    <div className={classes.container}>
      {selectionItems.map((item) => {
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
