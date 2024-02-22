import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";
import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import Avatar from "react-avatar";
import { Tooltip, Whisper } from "rsuite";
import { MDBIcon } from "mdb-react-ui-kit";

export default function MatchCompletedItem(props) {
  const { matchCompletedData } = props;
  const { auth } = useAuth();
  const [style, setStyle] = useState({});
  const [data, setData] = useState(matchCompletedData);
  const classes = useStyles();
  const [openInteraction, setOpenInteraction] = useState(false);

  useEffect(() => {
    setData(matchCompletedData);
  }, [matchCompletedData]);

  const handleSelectMatchCompleted = () => {
    setOpenInteraction(true);
  };

  return (
    <>
      <Whisper
        trigger="hover"
        placement={"bottom"}
        speaker={
          <Tooltip
            style={{
              fontSize: "0.7rem",
              fontFamily: "Montserrat",
              backgroundColor: colors.secondary,
              color: colors.primary,
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            Agregar opinion o volver a contactar!
          </Tooltip>
        }
      >
        <div
          onClick={() => handleSelectMatchCompleted()}
          style={style}
          className={classes.chatUserItem}
        >
          {!data?.user?.picture ? (
            <div
              className={classes.imageContainer}
              onClick={() => {
                setOpenInteraction(true);
              }}
            >
              <Avatar
                size="100%"
                name={data?.user?.name}
                maxInitials={2}
                round={true}
              />
            </div>
          ) : (
            <div
              className={classes.imageContainer}
              onClick={() => {
                setOpenInteraction(true);
              }}
            >
              <img className={classes.image} src={data?.user?.picture} />
            </div>
          )}

          <span
            className={classes.chatUserItemText}
            style={{
              width: "70%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "left",
            }}
          >
            {data?.user?.name}
          </span>

          <div className={classes.chatUserItemNewNotification}>
            <MDBIcon icon="ribbon" />
          </div>
        </div>
      </Whisper>
    </>
  );
}

const useStyles = createUseStyles({
  chatUserItem: {
    width: "90%",
    height: "4rem",
    position: "relative",
    paddingLeft: "0.5rem",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    display: "flex",
    justifyContent: "flex-start",
    gap: "1rem",
    alignItems: "center",
    //backgroundColor: colors.primary,
    cursor: "pointer",
    borderBottom: `solid 1px ${colors.transparent}`,
    transition: "border 0.3s, background 0.3s",

    "&:hover": {
      backgroundColor: colors.secondary,
    },
  },
  imageContainer: {
    width: "2.7rem",
    height: "2.7rem",
    borderRadius: "100%",
    outline: "solid 1px " + colors.textSecondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    transition: "outline 0.1s",

    "&:hover": {
      outline: "solid 3px " + colors.textSecondary,
    },
  },
  image: {
    width: "92%",
    height: "90%",
    borderRadius: "100%",
    objectFit: "cover",
  },
  chatUserItemText: {
    color: colors.white,
    fontWeight: "200",
    fontSize: "1rem",
  },
  chatUserItemNewNotification: {
    position: "absolute",
    fontSize: "1rem",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: "5%",
    height: "1.5rem",
    fontWeight: "300",
    color: colors.textSecondary,
  },
});
