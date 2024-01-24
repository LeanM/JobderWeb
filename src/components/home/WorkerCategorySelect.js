import { useEffect, useState } from "react";
import Select from "react-select";
import { colors } from "../../assets/colors";
import { createUseStyles } from "react-jss";

export default function WorkerCategorySelect(props) {
  const [categories, setCategories] = useState([]);
  const [listOptions, setListOptions] = useState([]);
  const [value, setValue] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const classes = useStyles();

  useEffect(() => {
    let cat = [
      { id: 1, categoryName: "Electricista" },
      { id: 2, categoryName: "Plomero" },
      { id: 3, categoryName: "Carpintero" },
      { id: 4, categoryName: "Jardinero" },
      { id: 5, categoryName: "Gasista" },
    ];
    setCategories(cat);
  }, []);

  useEffect(() => {
    fillOptions(categories);
  }, [categories]);

  useEffect(() => {
    props.onSelect(categoryName);
  }, [categoryName]);

  const fillOptions = () => {
    let array_options = [];
    categories.map((category) => {
      array_options.push({
        value: category.id,
        label: category.categoryName,
      });
    });
    setListOptions(array_options);
  };

  return (
    <Select
      className={classes.container}
      placeholder="Seleccione el rubro"
      defaultValue={value}
      onChange={(e) => {
        if (e != null) {
          setValue(e?.value);
          setCategoryName(e?.label);
        } else setValue(0);
      }}
      options={listOptions}
      isSearchable
      isClearable
      noOptionsMessage={() => "No se encontro ese rubro..."}
      styles={{
        menuList: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: colors.secondary,
          color: colors.primary,
        }),
        container: (baseStyles, state) => ({
          ...baseStyles,
          borderRadius: "30px",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? colors.hover : colors.primary,
          color: state.isFocused ? colors.primary : colors.secondary,
          transition: "background 0.5s ease, color 0.5s ease",
        }),
        noOptionsMessage: (baseStyles, state) => ({
          ...baseStyles,
          color: colors.primary,
        }),

        placeholder: (baseStyles, state) => ({
          ...baseStyles,
          color: colors.primary,
        }),
        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          color: colors.secondary,
        }),

        input: (baseStyles, state) => ({
          ...baseStyles,
          color: colors.primary,
          margin: "auto",
        }),
      }}
    ></Select>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "17rem",
    height: "3rem",
  },
});
