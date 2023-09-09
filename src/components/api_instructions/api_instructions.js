

const init = () => {
    let paginationTriggers = document.querySelectorAll('.api-dialog-pagination'),
    activePage    = () => +document.querySelector('.api-dialog-pagination:checked').value,
    prevButton    = document.getElementById('api-dialog-button-prev'),
    exampleButton = document.getElementById('api-dialog-button-example'),
    nextButton    = document.getElementById('api-dialog-button-next');

    console.log('paginationTriggers :', paginationTriggers);
    console.log('activePage :', activePage);
    console.log('prevButton :', prevButton);
    console.log('nextButton :', nextButton);


    nextButton.addEventListener('click',    ()=>performPagination('+1'));
    exampleButton.addEventListener('click', (e, trg=e.target)=>{const toggler = document.getElementById('toggle-examples-' + activePage()); toggler.checked=!toggler.checked;});
    prevButton.addEventListener('click',    ()=>performPagination('-1'));

    document.querySelectorAll('.api-dialog-header-indicator').forEach((el, i)=>el.addEventListener('click', (e, trg=e.target)=>{e.preventDefault(); performPagination(i)}));


    const performPagination = (newPage) => {
        setTimeout(()=>{
        let totalPages                             = paginationTriggers.length-1
        let calculatedPage                         = /^[+-]\d*$/.test(newPage) ? Math.min(Math.max((activePage() + (1 * newPage))-1,0),totalPages) : Math.min(Math.max((newPage-1),0),totalPages);
        paginationTriggers[calculatedPage].checked = true;
        prevButton.disabled                        = (calculatedPage === 0);
        exampleButton.disabled                     = (!document.getElementById('toggle-examples-' + activePage()));
        nextButton.disabled                        = (calculatedPage === totalPages);
        let activeExample = document.querySelector('.example-toggler:checked')
        if(activeExample) activeExample.checked = false;
        }, 0);
    }
}

document?.addEventListener('DOMContentLoaded', init, false);
