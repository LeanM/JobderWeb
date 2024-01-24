import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";
import { MDBIcon } from "mdb-react-ui-kit";

export default function Review(props) {
  const classes = useStyles();
  const { reviewData } = props;
  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        <img className={classes.image} src="./worker.jpg" />
        <p style={{ color: colors.white, fontWeight: "800" }}>Leandro</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.2rem",
            color: colors.secondary,
          }}
        >
          <MDBIcon icon="star" style={{ color: "yellow", fontWeight: "200" }} />
          <p>3.5</p>
        </div>
      </div>
      <div className={classes.descriptionContainer}>
        <span className={classes.descriptionText}>
          "{reviewData.description} asdjkasj askldjaskld askldaskldn"
        </span>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "7rem",
    backgroundColor: colors.primary,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    width: "95%",
    height: "30%",
    paddingTop: "0.5rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    gap: "0.5rem",
  },
  image: {
    width: "2rem",
    height: "2rem",
    borderRadius: "100%",
    objectFit: "cover",
  },
  descriptionContainer: {
    width: "100%",
    height: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.white,
    fontWeight: "100",
    textAlign: "start",
  },
  descriptionText: {
    width: "90%",
    height: "85%",
    maxLines: "2",
  },
});
