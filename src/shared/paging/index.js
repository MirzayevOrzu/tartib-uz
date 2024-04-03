function getPageOffsetAndLimit(pageNumber, itemsPerPage = 10) {
  const offset = (pageNumber - 1) * itemsPerPage;
  const limit = itemsPerPage;
  return { offset, limit };
}

function getPaginationLinks(
  pageNumber,
  totalCount,
  itemsPerPage = 10,
  maxPagesToShow = 10
) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

  let startPage = Math.max(1, pageNumber - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Ensure that we have enough pages to display on the right
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const links = {
    current: pageNumber,
    total: totalPages,
    next: nextPage,
    prev: prevPage,
    pages: [],
  };

  // Calculate links for individual pages within the range
  for (let i = startPage; i <= endPage; i++) {
    links.pages.push({
      url: `?page=${i}`,
      label: `${i}`,
    });
  }

  return links;
}

module.exports = {
  getPageOffsetAndLimit,
  getPaginationLinks,
};
