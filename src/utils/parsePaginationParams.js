export const parsePaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;

  return {
    page,
    perPage,
  };
};

export const parseSortParams = (query) => {
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

  return {
    sortBy,
    sortOrder,
  };
};
