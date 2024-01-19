import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";

export default function Review(props) {
  const classes = useStyles();
  const { reviewData } = props;
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>{reviewData.description}</div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "6rem",
  },
  subContainer: {
    width: "99%",
    height: "95%",
    backgroundColor: colors.primary,
    borderRadius: "20px",
  },
});
