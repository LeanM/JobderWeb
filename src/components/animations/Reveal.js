import { motion, useInView, useAnimation } from "framer-motion";
import React, { useState } from "react";
import { useEffect, useRef } from "react";

export default function Reveal(props) {
  const { styles } = props;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { animationVariant } = props;

  const variants = {
    left: {
      hidden: { opacity: 0, x: -75 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 75 },
      visible: { opacity: 1, x: 0 },
    },
    top: {
      hidden: { opacity: 0, y: -75 },
      visible: { opacity: 1, y: 0 },
    },
    bottom: {
      hidden: { opacity: 0, y: 75 },
      visible: { opacity: 1, y: 0 },
    },
  };

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      mainControls.start("stand");
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className={styles}
      variants={
        animationVariant === "top"
          ? variants.top
          : animationVariant === "left"
          ? variants.left
          : animationVariant === "right"
          ? variants.right
          : variants.bottom
      }
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {props.children}
    </motion.div>
  );
}
