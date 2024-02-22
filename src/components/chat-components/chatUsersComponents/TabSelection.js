import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../assets/colors";
import TabSelectionItem from "./TabSelectionItem";

export default function TabSelection(props) {
  const [actualSelectionId, setActualSelectionId] = useState(1);
  const classes = useStyles();
  const { selectionItemsArray, startSelection } = props;

  const onSelectItem = (selectedItemId, selectedItemCode) => {
    if (actualSelectionId !== selectedItemId) {
      setActualSelectionId(selectedItemId);
      props.onSelect(selectedItemCode);
    }
  };

  return (
    <div className={classes.container}>
      {selectionItemsArray.map((item) => {
        if (startSelection === item.id) {
          setActualSelectionId(item.id);
        }
        return (
          <TabSelectionItem
            key={item.id}
            actualSelection={actualSelectionId}
            itemData={item}
            onSelect={(id, code) => onSelectItem(id, code)}
          />
        );
      })}
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
