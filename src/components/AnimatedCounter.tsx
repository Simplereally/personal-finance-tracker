"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  decimal?: number;
  amount: number;
}

const AnimatedCounter = ({ decimal = 0, amount }: AnimatedCounterProps) => {
  const [prevAmount, setPrevAmount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }

    const timer = setTimeout(() => {
      setPrevAmount(amount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [amount, hasInitialized]);

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
