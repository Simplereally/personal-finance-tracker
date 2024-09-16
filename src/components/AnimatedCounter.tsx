"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  decimal?: number;
  amount: number;
}

const AnimatedCounter = ({ decimal = 0, amount }: AnimatedCounterProps) => {
  const [prevAmount, setPrevAmount] = useState(amount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevAmount(amount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [amount]);

  return (
    <CountUp
      start={prevAmount}
      end={amount}
      decimals={decimal}
      decimal="."
      duration={1}
    />
  );
};

export default AnimatedCounter;
