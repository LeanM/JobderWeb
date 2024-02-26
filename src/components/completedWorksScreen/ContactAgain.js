import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ContactAgain(props) {
  const { userInteractionData } = props;
  const classes = useStyles();
  const [textValue, setTextValue] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleContactAgain = () => {
    let interactionInfo = {
      workerId: userInteractionData?.user?.id,
      interactionType: "CLIENT_LIKE",
      clientProblemDescription: textValue,
      clientUrgency: userInteractionData?.interaction?.clientUrgency,
    };

    toast.promise(interactWithWorker(interactionInfo), {
      loading: "Contactando al trabajador...",
      success: (response) => {
        navigate("/chat");

        return <b>Chatea con el trabajador en la pestaña de "Solicitados"</b>;
      },
      error: (error) => {
        if (error?.response?.status === 401)
          navigate("/login", {
            state: { from: "/clientLanding" },
            replace: true,
          });
        return <b>Ocurrio un error al comunicarse con el trabajador!</b>;
      },
    });
  };

  const interactWithWorker = async (interactionInfo) => {
    return axiosPrivate.post(
      "matching/client/interaction",
      JSON.stringify(interactionInfo)
    );
  };

  return (
    <div className={classes.container}>
      <span
        style={{
          color: colors.textSecondary,
          textAlign: "center",
        }}
      >
        Tienes otro problema y te gusto el trabajo de{" "}
        {userInteractionData?.user?.name}?
      </span>
      <textarea
        className={classes.inputText}
        style={{ resize: "none" }}
        type="text"
        rows="5"
        value={textValue}
        placeholder="Especifica tu problema..."
        onChange={(e) => setTextValue(e.target.value)}
      />
      <button
        className={classes.contactButton}
        onClick={() => handleContactAgain()}
      >
        Volver a contactar!
      </button>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "1rem",
  },
  inputText: {
    borderRadius: "10px",
    width: "70%",
    backgroundColor: colors.primary,
    border: "solid 1px " + colors.textSecondary,
    color: colors.textSecondary,
    outline: "none",
  },
  contactButton: {
    width: "10rem",
    height: "2.5rem",
    backgroundColor: colors.primary,
    borderRadius: "5px",
    color: colors.textSecondary,
    border: "solid 1px " + colors.secondary,
    transition: "background 0.2s, color 0.2s",

    "&:hover": {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },
  },
});
