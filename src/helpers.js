export const omit = (keysToOmit, obj) => 
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !keysToOmit.includes(key))
  );

export const namespaceData = (namespace, obj) => 
  namespace ? {[namespace]: obj} : obj;
  

let locked = false;

export const withLock = (cb) => {
  if (locked) {
    setTimeout(() => withLock(cb), 1);
  };

  locked = true;
  cb();
};
