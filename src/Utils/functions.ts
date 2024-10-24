export const getLowest = (list = [0]) => {
  return list.reduce(
    (final, current) => (current < final ? current : final),
    list[0]
  );
};
export const getHighest = (list = [0]) => {
  return list.reduce(
    (final, current) => (current > final ? current : final),
    list[0]
  );
};
export const getAverage = (list = [0]) => {
  return list.reduce((final, current) => (current += final), 0) / list.length;
};
