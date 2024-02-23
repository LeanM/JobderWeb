import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { colors } from "../../assets/colors";
import Nav from "../pagewrappers/Nav";
import CompletedCarousel from "./completedCarouselComponents/CompletedCarousel";
import WorkerCard from "../home/worker-card/WorkerCard";
import ReviewSend from "./ReviewSend";

export default function Completed() {
  const axiosPrivate = useAxiosPrivate();
  const [completedUsersInteractions, setCompletedUsersInteractions] = useState(
    []
  );
  const [selectedUserInteraction, setSelectedUserInteraction] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    fetchMatchesCompletedUsers();
  }, []);

  useEffect(() => {
    console.log(selectedUserInteraction);
  }, [selectedUserInteraction]);

  const fetchMatchesCompletedUsers = () => {
    axiosPrivate
      .post("/matching/client/matchesCompletedWorkers")
      .then((response) => setCompletedUsersInteractions(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Nav />
      <div className={classes.containter}>
        <div className={classes.subContainer}>
          <span className={classes.mainTitle}>
            Aqui puedes observar los trabajadores que han completado un trabajo
            para ti
          </span>
          <div className={classes.completedCarouselContainer}>
            <CompletedCarousel
              completedUsersInteractions={completedUsersInteractions}
              onSelect={(userInteraction) =>
                setSelectedUserInteraction(userInteraction)
              }
            />
          </div>
          <div className={classes.completedUserInteractionInfoContainer}>
            {selectedUserInteraction ? (
              <>
                <div className={classes.workerCardInfoContainer}>
                  <WorkerCard
                    infoOnly={true}
                    workerData={selectedUserInteraction}
                  />
                </div>
                <div className={classes.interactionInfoContainer}>
                  <span>
                    {
                      selectedUserInteraction?.interaction
                        ?.clientProblemDescription
                    }
                  </span>
                  <span>{selectedUserInteraction?.interaction?.closedAt}</span>
                </div>
                <div className={classes.dataContainer}>
                  <div className={classes.addReviewContainer}>
                    <ReviewSend workerData={selectedUserInteraction?.user} />
                  </div>
                </div>
                <button>Volver a contactar!</button>
              </>
            ) : (
              <></>
            )}
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
  completedCarouselContainer: {
    width: "50%",
    height: "7rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  completedUserInteractionInfoContainer: {
    height: "80vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4rem",
  },
  workerCardInfoContainer: {
    width: "30%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  interactionInfoContainer: {
    width: "30%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.textSecondary,
    borderRadius: "10px",
  },
  dataContainer: {
    width: "30%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  addReviewContainer: {
    width: "70%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
});
