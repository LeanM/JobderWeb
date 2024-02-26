import Review from "./Review";
import Slider from "react-slick";
import { useEffect, useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../../../../assets/colors";
import { fetchWorkerReviewsExample } from "../../../../connection/requests";

export default function ReviewCarousel(props) {
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [draggable, setDraggable] = useState(false);

  const { reviews } = props;
  const [actualReviews, setActualReviews] = useState([]);

  const sliderRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    console.log(reviews);
    setActualReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    // Agregar un event listener para manejar cambios en el tamaño de la ventana
    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    /*
    if (viewportSize.width < 500) setSlidesToShow(2);
    else if (viewportSize.width < 800) setSlidesToShow(2);
    else if (viewportSize.width < 1100) setSlidesToShow(3);
    else setSlidesToShow(4);
    */
    if (viewportSize.width < 800) setDraggable(true);
  }, [viewportSize]);

  let settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
  };

  return (
    <div className={classes.container}>
      <button
        className={classes.button}
        onClick={() => sliderRef.current.slickPrev()}
      >
        ❮
      </button>
      <Slider
        className={classes.slider}
        ref={sliderRef}
        {...settings}
        arrows={false}
        swipeToSlide={true}
        draggable={draggable}
      >
        {actualReviews.map((review) => {
          return <Review key={review.id} reviewData={review} />;
        })}
      </Slider>
      <button
        className={classes.button}
        onClick={() => sliderRef.current.slickNext()}
      >
        ❯
      </button>
    </div>
  );
}

const useStyles = createUseStyles({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  slider: {
    width: "80%",
  },
  button: {
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    textAlign: "center",
    backgroundColor: colors.secondary,
    color: colors.primary,
    transition: "background 0.5s ease-in-out, color 0.5s",

    "&:hover": {},
  },
});
