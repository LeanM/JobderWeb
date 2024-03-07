import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { MDBIcon } from "mdb-react-ui-kit";
import Avatar from "react-avatar";

export default function ReviewOption(props) {
  const classes = useStyles();
  const { data, onSelected } = props;
  return (
    <div className={classes.container} onClick={() => onSelected(data)}>
      <div className={classes.subContainer}>
        <div className={classes.topContainer}>
          {!data?.client?.picture ? (
            <div className={classes.imageContainer}>
              <Avatar
                size="100%"
                name={data?.client?.name}
                maxInitials={2}
                round={true}
              />
            </div>
          ) : (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={data?.client?.picture} />
            </div>
          )}

          <p style={{ color: colors.white, fontWeight: "800" }}>
            {data?.client?.name}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.2rem",
              color: colors.secondary,
            }}
          >
            <MDBIcon
              icon="star"
              style={{ color: "yellow", fontWeight: "200" }}
            />
            <p>{data?.review?.rating}</p>
          </div>
        </div>
        <div className={classes.descriptionContainer}>
          <span
            className={classes.descriptionText}
            style={{
              width: "90%",
              textAlign: "left",
            }}
          >
            "{data?.review?.content}"
          </span>
        </div>
      </div>
      {data?.reviewResponse ? (
        <div className={classes.reviewResponseContainer}>
          {!data?.worker?.picture ? (
            <div className={classes.responseImageContainer}>
              <Avatar
                size="100%"
                name={data?.worker?.name}
                maxInitials={2}
                round={true}
              />
            </div>
          ) : (
            <div className={classes.responseImageContainer}>
              <img className={classes.image} src={data?.worker?.picture} />
            </div>
          )}
          <span
            style={{
              width: "80%",
              textAlign: "left",
              fontSize: "0.7rem",
              fontWeight: "200",
              padding: "10px",
            }}
          >
            "{data?.reviewResponse?.content}"
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  subContainer: {
    width: "95%",
    backgroundColor: colors.primaryDark,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    border: "solid 2px " + colors.transparent,

    transition: "border 0.2s",

    "&:hover": {
      border: "solid 2px " + colors.secondary,
    },
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
  imageContainer: {
    width: "2rem",
    height: "2rem",
    borderRadius: "100%",
  },
  responseImageContainer: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    objectFit: "cover",
  },
  descriptionContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: colors.white,
    fontWeight: "100",
    textAlign: "start",
    paddingBottom: "1rem",
  },
  descriptionText: {
    width: "90%",
    height: "85%",
    maxLines: "2",
  },
  reviewResponseContainer: {
    width: "70%",
    minHeight: "3rem",
    borderRadius: "20px",
    backgroundColor: colors.secondary,
    color: colors.white,
    paddingLeft: "0.5rem",
    gap: "0.6rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row-reverse",
    marginLeft: "auto",
  },
});
