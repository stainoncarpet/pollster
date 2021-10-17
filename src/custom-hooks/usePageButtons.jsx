import React from 'react';

const usePageButtons = (totalPollsCount, currentPage, handleSetCurrentPage) => {
    const pagesToDraw = Math.ceil(totalPollsCount / 10);
    let pageButtons = [];
    let limit = 0;
    const middle = Math.ceil(pagesToDraw / 2);
    let isPrevButtonWithDots = false;

    for(let i = 0; i < pagesToDraw; i++){
        const isCurrentPage = i + 1 === currentPage;
        const buttonWithNumber = (<li key={i}><a className={`pagination-link ${(i + 1 === currentPage ? "is-current" : '').trim()}`}
                                    aria-label={`Goto page ${i + 1}`}
                                    aria-current={isCurrentPage ? "page" : null}
                                    onClick={isCurrentPage ? null : () => handleSetCurrentPage(null, i + 1)}>{i + 1}</a>
                                </li>);
        const buttonWithDots = (<li key={i}><span className="pagination-ellipsis">&hellip;</span></li>);

        if(pagesToDraw < 6){
            pageButtons.push(buttonWithNumber);
        } else {
            if(i + 1 === 1 || i + 1 === pagesToDraw || ((i + 1 === middle - 1 || i + 1=== middle || i + 1 === middle + 1) && currentPage === middle)){
                pageButtons.push(buttonWithNumber);
                isPrevButtonWithDots = false;
            } else if (i + 1 === currentPage - 1 || (i + 1 === currentPage - 2 && currentPage === pagesToDraw) ||i + 1 === currentPage || i + 1 === currentPage + 1 || (i + 1 === currentPage + 2 && currentPage === 1)) {
                pageButtons.push(buttonWithNumber);
                isPrevButtonWithDots = false;
            } else {
                if(limit < 2 && !isPrevButtonWithDots){
                    pageButtons.push(buttonWithDots);
                    limit++;
                    isPrevButtonWithDots = true;
                }
            }
        }
    }

    return [pageButtons, pagesToDraw];
}

export default usePageButtons;