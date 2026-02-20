export const calculatePagination = (
  page: number,
  limit: number,
  total: number,
) => {
  const maxPageCount = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  return { maxPageCount, offset };
};
