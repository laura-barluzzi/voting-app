export const copyPollObj = (poll) => JSON.parse(JSON.stringify(poll));

export const getOptObjWithNoVotes = (optionsArray) => {
  const optionsObj={};
  optionsArray.forEach((option) => optionsObj[option] = 0);
  return optionsObj;
};

export const namesArray = (optionsObj) => Object.keys(optionsObj);

export const deleteOptionByIndex = (optionsArray, indexToRemove) => {
    const newOptions = optionsArray.slice();
    newOptions.splice(indexToRemove, 1);
    return newOptions;
};

export const deletePollById = (pollList, pollIdToRemove) => {
  const newPolls = Object.assign({}, pollList);
  delete newPolls[pollIdToRemove];
  return newPolls;
};

export const changeOption = (optionsArray, indexToChange, newValue) => {
  const newOptions = optionsArray.slice();
  newOptions[indexToChange] = newValue;
  return newOptions;
};

export const validateOption = (value) => value.length > 0;

export const validateTitle = (value) => value.length > 0;

export const votesArray = (optionsObj) => Object.values(optionsObj);

export const totalOfPollVotes = (pollVotesArray, tot=0) => {
  pollVotesArray.forEach((vote) => tot += vote);
  return tot;
};

export const percentOptionVote = (optionVote, totalPollVotes) =>
  Math.round((optionVote / totalPollVotes) * 100);