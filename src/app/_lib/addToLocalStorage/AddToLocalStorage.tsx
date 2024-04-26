"use client";
import { useState } from "react";

const useLocalStorage = (key: any, initialValue: any) => {
  const [state, setState] = useState(() => {
    // Initialize the state
    try {
      if (typeof window !== "undefined") {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
      }
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
    } catch (error) {
      console.log(error);
    }
  });

  const setValue = (value: any) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};

export default useLocalStorage;
