import React from "react";
import usePageButtons from "../../../custom-hooks/usePageButtons.jsx";

const Pagination = ({totalPollsCount, currentPage, handleSetCurrentPage}) => {
    const [pageButtons, pagesToDraw] = React.useMemo(() => usePageButtons(totalPollsCount, currentPage, handleSetCurrentPage), [totalPollsCount, currentPage]);

    if(totalPollsCount > 10){
        return (
            <nav className="pagination is-centered mb-6 mt-6" role="navigation" aria-label="pagination">
                <button className="pagination-previous" disabled={!(currentPage > 1)} onClick={(e) => handleSetCurrentPage(e, null, -1)}>Previous</button>
                <button className="pagination-next" disabled={!(currentPage !== pagesToDraw)} onClick={(e) => handleSetCurrentPage(e, null, 1)}>Next page</button>
                <ul className="pagination-list">
                    {pageButtons}
                </ul>
            </nav>
        );
    } else {
        return null;
    }
};

export default Pagination;