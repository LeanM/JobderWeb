import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import toast from "react-hot-toast";

export default function ReviewSend(props) {
  const { workerData } = props;
  const [ratingValue, setRatingValue] = useState(1);
  const [textValue, setTextValue] = useState("");
  const classes = useStyles();

  useEffect(() => {
    console.log(ratingValue);
  }, [ratingValue]);

  const handleSendReview = () => {
    let review = {
      workerId: workerData?.id,
      content: textValue,
      rating: ratingValue,
    };
  };

  return (
    <div className={classes.container}>
      <span
        style={{
          color: colors.secondary,
          fontSize: "2rem",
          fontWeight: "600",
        }}
      >
        Agregar opinion!
      </span>
      <div className={classes.reviewInputContainer}>
        <textarea
          style={{
            height: "10rem",
            width: "20rem",
            resize: "none",
            outline: "none",
            border: "none",
            padding: "10px",
            color: colors.white,
            backgroundColor: colors.primary,
            borderRadius: "10px",
            border: "solid 1px",
            borderColor: colors.secondary,
          }}
          placeholder="Describe como fue tu experiencia con el trabajador..."
          onChange={(e) => setTextValue(e.target.value)}
        ></textarea>
        <Rating
          value={ratingValue}
          size="large"
          onChange={(event, newValue) => setRatingValue(newValue)}
        />
        <button
          className={classes.sendButton}
          onClick={() => {
            if (textValue === "")
              toast.error("Debes proporcionar una descripcion!");
            else handleSendReview();
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  reviewInputContainer: {
    width: "30rem",
    height: "20rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  },
  sendButton: {
    width: "5rem",
    height: "2rem",
    borderRadius: "5px",
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    border: "solid 1px " + colors.secondary,

    transition: "background 0.2s, color 0.2s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },
  },
});
