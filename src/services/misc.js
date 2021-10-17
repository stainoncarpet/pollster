export const updateSelectedOptionsArray = (votersArray, voterId) => {
    let arr = [];
    for(let i = 0; i < votersArray.length; i++){
        votersArray[i].includes(voterId) ? arr.push(true) : arr.push(false);
    }
    return arr;
};

export const shuffleSelectedOptions = (multichoice, oldSelectedOptions, optionIndex) => {
    let newSelectedOptions;
        if(multichoice === true){
            newSelectedOptions = [...oldSelectedOptions];
            newSelectedOptions[optionIndex] = !oldSelectedOptions[optionIndex];
        } else if (multichoice === false) {
            newSelectedOptions = new Array(oldSelectedOptions.length).fill(false);
            newSelectedOptions[optionIndex] = true;
        } else {
            newSelectedOptions = [...oldSelectedOptions];
        }
        return newSelectedOptions;
};

export const scrollToTop = () => window.scrollTo(0,0);

export const checkTokens = (user, dispatch = null, logOut = null, logoutMessage = null) => {
    if((document.cookie.indexOf("auth_token") !== -1 && document.cookie.indexOf("refresh_token") !== -1) && user){
        return true;
    } else {
        user && dispatch && dispatch(logOut(logoutMessage, true));
        return false;
    }
};

export const validateEmail = (email) => {
    const isInvalid = email.length < 6 || !(email.match(/[0-9a-z]+@.+\.[a-z][a-z]+$/));
    return !isInvalid;
}; 

export const validatePassword = (password) => {
    const containsDigits = !!password.match(/[0-9]/);
    const containsUppercaseLetters = !!password.match(/[A-Z]/);
    const containsLowercaseLetters = !!password.match(/[a-z]/);
    const containsSpecialCharacters = !!password.match(/[!@#$%^&*]/);
    const isLongEnough = password.length >= 6;
    
    return containsDigits && containsUppercaseLetters && containsLowercaseLetters && containsSpecialCharacters && isLongEnough;
};

export const validateNickname = (nickname) => {
    return nickname.length > 1 && nickname.match(/^[0-9a-zA-Z]+$/);
};

export const getInputColor = (isValid) => {
    return isValid ? "unset" : "rgba(255, 0, 0, 0.25)"
};

export const filterOutIncorrectCharacters = (str) => {
    return str.match(/^[a-zA-Z0-9\s\!\?\,\.]*$/) && !(str.includes(",,") || str.includes("..") || str.includes("  ") || str.includes("!!") || str.includes("??"));
};

export const getPasswordPlaceholders = () => "digits/letters (both cases), special characters";