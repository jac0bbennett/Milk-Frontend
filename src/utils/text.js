const Truncate = (title, len) => {
  if (title.length > len) return title.substring(0, len) + "...";
  else return title;
};

export { Truncate };
