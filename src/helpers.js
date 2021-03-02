export const omit = (keysToOmit, obj) => 
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !keysToOmit.includes(key))
  );
