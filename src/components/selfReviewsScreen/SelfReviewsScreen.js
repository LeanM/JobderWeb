import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ReviewOption from "./ReviewOption";
import ReviewItem from "../home/worker-card/review-modal/ReviewItem";

export default function SelfReviewsScreen() {
  const axiosPrivate = useAxiosPrivate();
  const [myReviews, setMyReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actualPage, setActualPage] = useState(1);

  const classes = useStyles();

  useEffect(() => {
    fetchMyReviews();
    console.log(actualPage);
  }, [actualPage]);

  const fetchMyReviews = async () => {
    let requestData = {
      pageNumber: actualPage - 1,
    };
    axiosPrivate
      .post("/review/myreviews/worker", JSON.stringify(requestData))
      .then((response) => setMyReviews(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Nav />
      <div className={classes.containter}>
        <div className={classes.subContainer}>
          <span className={classes.mainTitle}>
            Aqui puedes observar las opiniones de los clientes hacia ti!
          </span>
          <div className={classes.bodyContainer}>
            <div className={classes.paginationContainer}>
              <div className={classes.reviewsContainer}>
                {myReviews.map((review) => {
                  return (
                    <ReviewOption
                      data={review}
                      onSelected={(review) => setSelectedReview(review)}
                    />
                  );
                })}
              </div>
              <Pagination
                count={5}
                variant="outlined"
                color="secondary"
                page={actualPage}
                onChange={(event, page) => setActualPage(page)}
              />
            </div>
            <div className={classes.reviewInfoContainer}>
              {selectedReview ? (
                <>
                  <ReviewItem reviewData={selectedReview}></ReviewItem>
                  {!selectedReview?.reviewResponse ? (
                    <>
                      <textarea
                        style={{ resize: "none" }}
                        type="text"
                        rows="3"
                        placeholder="Responde brevemente al cliente..."
                      />
                      <button>Responder</button>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <span
                  style={{
                    color: colors.textSecondary,
                    fontWeight: "400",
                    fontSize: "1rem",
                  }}
                >
                  Selecciona una opinion para responderla!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const useStyles = createUseStyles({
  containter: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: colors.primary,
    paddingTop: "15rem",
    fontFamily: "Montserrat",
  },
  subContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mainTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: colors.textSecondary,
    textAlign: "center",
  },
  bodyContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5rem",
  },
  paginationContainer: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  reviewsContainer: {
    width: "90%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
  },
  reviewInfoContainer: {
    width: "65%",
    minHeight: "80vh",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  inputText: {},
});
