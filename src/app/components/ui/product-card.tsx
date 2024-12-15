"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { MotionValue, motion, useScroll, useSpring, useTransform } from "framer-motion";

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
  isReverse?: boolean;
}

export const ProductCardWrapper = ({ product, isReverse = false }: ProductCardProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isReverse ? -1000 : 1000]),
    springConfig
  );

  return (
    <div ref={ref}>
      <ProductCard product={product} translate={translateX} />
    </div>
  );
};

const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-96 w-[30rem] flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80"></div>
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
