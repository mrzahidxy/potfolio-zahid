import Visit from "./visitSchema";

export const readVisitCount = async () => {
  const visitDoc = await Visit.findOne();
  return visitDoc?.count ?? 0;
};

export const incrementVisitCount = async () => {
  const visitDoc = await Visit.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return visitDoc?.count ?? 0;
};
