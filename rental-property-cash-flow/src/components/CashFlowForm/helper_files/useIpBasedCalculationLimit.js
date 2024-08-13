import { useState, useEffect } from 'react';
import axios from 'axios';

const useIpBasedCalculationLimit = () => {
  const [isCalculateDisabled, setIsCalculateDisabled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const calculationLimit = 5;

  useEffect(() => {
    const checkCalculationLimit = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/calculations/check', {}, {
          withCredentials: true, // Ensure cookies are sent
        });
        const { calculationCount } = response.data;
        setClickCount(calculationCount);

        if (calculationCount >= calculationLimit) {
          setIsCalculateDisabled(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsCalculateDisabled(true);
        } else {
          console.error('Error checking calculation limit:', error);
        }
      }
    };

    checkCalculationLimit();
  }, []);

  const incrementCalculationCount = async () => {
    try {
      await axios.post('http://localhost:8000/api/calculations/increment', {}, {
        withCredentials: true, // Ensure cookies are sent
      });
      setClickCount((prev) => prev + 1);
      if (clickCount + 1 >= calculationLimit) {
        setIsCalculateDisabled(true);
      }
    } catch (error) {
      console.error('Error incrementing calculation count:', error);
    }
  };

  return {
    isCalculateDisabled,
    clickCount,
    incrementCalculationCount,
  };
};

export default useIpBasedCalculationLimit;
