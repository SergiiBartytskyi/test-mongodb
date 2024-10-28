export const timeEntryHandler = async (req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
};
