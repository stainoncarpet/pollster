const sortData = (propsOptions, propsVotes) => {
    const mergedArray = propsOptions.map((option, index) => {
        return {option: option, votes: propsVotes[index]};
    });
    
    const sortedArray = mergedArray.sort((a, b) => a.votes - b.votes);
    let optionsArray = new Array();
    let votesArray = new Array();

    for (let i = 0; i < sortedArray.length; i++){
        if(sortedArray[i].votes > 0){
            optionsArray.push(sortedArray[i].option);
            votesArray.push(sortedArray[i].votes);
        }
    }

    return {
        datasets: [{
            data: votesArray,
            backgroundColor: _getArrayOfRandomColors(propsOptions.length)
        }],
        labels: optionsArray
    };
};

const _getArrayOfRandomColors = (size) => {
    const array = new Array(size);
    for (let i=0; i < size; i++){
        array[i] = "#" + Math.floor(Math.random()*16777215).toString(16);
    }
    return array;
};

export {sortData};