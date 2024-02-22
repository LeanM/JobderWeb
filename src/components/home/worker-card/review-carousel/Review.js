import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";
import { MDBIcon } from "mdb-react-ui-kit";
import Avatar from "react-avatar";

export default function Review(props) {
  const classes = useStyles();
  const { reviewData } = props;
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        <div className={classes.topContainer}>
          {!reviewData?.client?.picture ? (
            <div className={classes.imageContainer}>
              <Avatar
                size="100%"
                name={reviewData?.client?.name}
                maxInitials={2}
                round={true}
              />
            </div>
          ) : (
            <div className={classes.imageContainer}>
              <img
                className={classes.image}
                src={reviewData?.client?.picture}
              />
            </div>
          )}

          <p style={{ color: colors.white, fontWeight: "800" }}>
            {reviewData?.client?.name}
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
            <p>{reviewData?.review?.rating}</p>
          </div>
        </div>
        <div className={classes.descriptionContainer}>
          <span
            className={classes.descriptionText}
            style={{
              width: "90%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "left",
            }}
          >
            "{reviewData?.review?.content}" aaaaaaa a a a a aaaaaaaa a a asd asd
            as das das dasd as
          </span>
        </div>
      </div>
      <div className={classes.reviewResponseContainer}>
        {!reviewData?.worker?.picture ? (
          <div className={classes.responseImageContainer}>
            <Avatar
              size="100%"
              name={reviewData?.worker?.name}
              maxInitials={2}
              round={true}
            />
          </div>
        ) : (
          <div className={classes.responseImageContainer}>
            <img className={classes.image} src={reviewData?.worker?.picture} />
          </div>
        )}
        <span
          style={{
            width: "80%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            textAlign: "left",
            fontSize: "0.7rem",
            fontWeight: "200",
          }}
        >
          "{reviewData?.reviewResponse?.content}"
        </span>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    position: "relative",
    height: "7rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "95%",
    height: "90%",
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
  imageContainer: {
    width: "2rem",
    height: "2rem",
    borderRadius: "100%",
  },
  responseImageContainer: {
    width: "1.7rem",
    height: "1.5rem",
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
  reviewResponseContainer: {
    position: "absolute",
    width: "70%",
    height: "2rem",
    borderRadius: "20px",
    backgroundColor: colors.secondary,
    color: colors.white,
    bottom: "0",
    right: "0",
    overflow: "visible",
    paddingLeft: "0.5rem",
    gap: "0.6rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
