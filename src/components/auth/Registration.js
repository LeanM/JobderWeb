import { createUseStyles } from "react-jss";
import WorkerRegistration from "./WorkerRegistration";

export default function Registration() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <WorkerRegistration />
    </div>
  );
}

const useStyles = createUseStyles({
  container: {},
});
