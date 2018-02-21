export const copyPollObj = (poll) => JSON.parse(JSON.stringify(poll));

export const getOptObjWithNoVotes = (optionsArray) => {
  const optionsObj={};
  optionsArray.forEach((option) => optionsObj[option] = 0);
  return optionsObj;
};

export const namesArray = (optionsObj) => Object.keys(optionsObj);

export const deleteOption = (optionsArray, indexToRemove) => {
    const newOptions = optionsArray.slice();
    newOptions.splice(indexToRemove, 1);
    return newOptions;
};

export const changeOption = (optionsArray, indexToChange, newValue) => {
  const newOptions = optionsArray.slice();
  newOptions[indexToChange] = newValue;
  return newOptions;
};

export const areOptionsValid = (optionNamesArray, checkEachNameValidation) => {
  const areOptionsValid = optionNamesArray.map(checkEachNameValidation);
  return areOptionsValid.every(isValid => isValid);
};

export const votesArray = (optionsObj) => Object.values(optionsObj);

export const totalOfPollVotes = (pollVotesArray, tot=0) => {
  pollVotesArray.forEach((vote) => tot += vote);
  return tot;
};

export const percentOptionVote = (optionVote, totalPollVotes) =>
  Math.round((optionVote / totalPollVotes) * 100);