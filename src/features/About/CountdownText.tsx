import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export function CountdownText() {
  const [countdown, setCountdown] = useState(9);

  const intervalRef = useRef<any>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(intervalRef.current);
    }
  }, [countdown]);

  return (
    <Typography variant="h4" align="center">
      Coming soon: {countdown}.
    </Typography>
  );
}
