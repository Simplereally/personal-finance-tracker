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
    // Update the previous amount after the animation
    const timer = setTimeout(() => {
      setPrevAmount(amount);
    }, 1000); // Adjust this timeout to match your animation duration

    return () => clearTimeout(timer);
  }, [amount]);

  return (
    <div className="w-full">
      <CountUp
        start={prevAmount}
        end={amount}
        decimals={decimal}
        decimal="."
        duration={1} // Adjust the duration as needed
      />
    </div>
  );
};

export default AnimatedCounter;
