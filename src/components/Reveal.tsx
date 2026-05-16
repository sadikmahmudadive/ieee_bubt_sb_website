"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
};

export const Reveal = ({ 
  children, 
  width = "100%", 
  delay = 0, 
  duration = 0.5,
  y = 20,
  x = 0,
  scale = 1
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y, x, scale },
          visible: { opacity: 1, y: 0, x: 0, scale: 1 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const RevealList = ({ 
  children, 
  delay = 0, 
  interval = 0.1,
  y = 20
}: { 
  children: ReactNode[]; 
  delay?: number; 
  interval?: number;
  y?: number;
}) => {
  return (
    <>
      {children.map((child, index) => (
        <Reveal key={index} delay={delay + index * interval} y={y}>
          {child}
        </Reveal>
      ))}
    </>
  );
};
