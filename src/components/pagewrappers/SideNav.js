import { useEffect, useRef, useState } from "react";
import { Drawer, ButtonToolbar, Button, Placeholder } from "rsuite";
import { createUseStyles } from "react-jss";
import { MDBBtnGroup, MDBIcon } from "mdb-react-ui-kit";
import { colors } from "../../assets/colors";
import { useNavigate } from "react-router-dom";

export default function SideNav(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [navStyle, setNavStyle] = useState({ color: colors.secondary });

  const closeDrawer = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (props?.type === "alter") {
      setNavStyle({
        color: colors.nav,
      });
    }
  }, []);

  return (
    <>
      <MDBBtnGroup className={classes.openButton} onClick={() => setOpen(true)}>
        <MDBIcon
          icon="bars"
          className={classes.foldedNavIcon}
          style={navStyle}
        />
      </MDBBtnGroup>
      <Drawer size="full" open={open} onClose={() => setOpen(false)}>
        <Drawer.Body className={classes.drawer}>
          <div
            className={classes.drawerItem}
            onClick={() => {
              navigate("/");
              closeDrawer();
            }}
          >
            <p className={classes.drawerItemText}>INICIO</p>
          </div>
          <div
            className={classes.drawerItem}
            onClick={() => {
              navigate("/contact");
              closeDrawer();
            }}
          >
            <p className={classes.drawerItemText}>CONTACTANOS</p>
          </div>
          <div
            className={classes.drawerItem}
            onClick={() => {
              navigate("/gallery");
              closeDrawer();
            }}
          >
            <p className={classes.drawerItemText}>GALERIA</p>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
}

const useStyles = createUseStyles({
  openButton: {
    display: "none",
    width: "3rem",
    height: "3rem",
    position: "absolute",
    right: "10px",

    "@media screen and (max-width: 800px)": {
      display: "block",
    },
  },
  foldedNavIcon: {
    textShadow: `0 0 2px ${colors.textNav}`,
    fontSize: "2rem",
    marginTop: "1rem",
  },
  drawer: {
    width: "100%",
    backgroundColor: colors.nav,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  drawerItem: {
    width: "75%",
    height: "4rem",
    borderBottom: `solid 1px ${colors.textNav}`,
    borderRadius: "20px 20px 20px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.white,

    transition: "color 0.3s, background 0.3s",

    "&:hover": {
      backgroundColor: colors.textNav,
      color: colors.nav,
    },
  },
  drawerItemText: {
    fontSize: "1.2rem",
    fontFamily: "Poppins",
    fontWeight: "200",
    textAlign: "center",
  },
});
