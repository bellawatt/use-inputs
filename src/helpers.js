export const omit = (keysToOmit, obj) => omitDeep(obj, createOmitMap(keysToOmit));

const omitDeep = (obj, omitMap) => {
  
  const objCopy = {};

  if (Array.isArray(obj)) {
    if (Object.keys(omitMap['[]']).length > 0) {
      return obj.map(el => omitDeep(el, omitMap['[]']))
    } else {
      return obj;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (omitMap[key]) {
        if (Object.keys(omitMap[key]).length > 0) {
          objCopy[key] = omitDeep(obj[key], omitMap[key]);
        }
      } else {
        objCopy[key] = obj[key];
      }
    });
  } else {
    return obj;
  }

  return objCopy;
};

const createOmitMap = (keysToOmit) => {
  const omitMap = {};

  keysToOmit.forEach(key => {
    let objSegment = omitMap;
    
    key.split('.').forEach(currentKey => {
      objSegment[currentKey] = objSegment[currentKey] ? objSegment[currentKey] : {};
      objSegment = objSegment[currentKey];
    });
  });

  return omitMap;
};
