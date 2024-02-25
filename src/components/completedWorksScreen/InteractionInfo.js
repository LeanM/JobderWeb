import { createUseStyles } from "react-jss";
import { colors } from "../../assets/colors";
import { format } from "date-fns";

export default function InteractionInfo(props) {
  const { interactionData } = props;

  const classes = useStyles();

  const formatDate = (date) => {
    const timestamp = new Date(format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));

    const year = timestamp.getFullYear();
    const month = ("0" + (timestamp.getMonth() + 1)).slice(-2); // Suma 1 ya que los meses van de 0 a 11
    const day = ("0" + timestamp.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  return (
    <div className={classes.container}>
      <span style={{ fontWeight: "700" }}>Tu match se inicio en la fecha</span>
      <span>{formatDate(interactionData?.createdAt)}</span>
      {interactionData?.clientProblemDescription ? (
        <>
          <span style={{ fontWeight: "700" }}>
            Tuviste el siguiente problema
          </span>
          <span>{interactionData?.clientProblemDescription}</span>
        </>
      ) : (
        <></>
      )}
      <span style={{ fontWeight: "700" }}>
        El trabajador finalizo el trabajo en
      </span>
      <span>{formatDate(interactionData?.closedAt)}</span>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.primary,
    color: colors.textSecondary,
    border: "solid 1px " + colors.secondary,
    borderRadius: "10px",
    gap: "1rem",
  },
});
