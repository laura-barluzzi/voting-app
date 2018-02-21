// Header messages
export const welcomeLoggedOut = "Join and create personalized polls";
export const welcomeUser = (name) => `Welcome ${name}`;

// Page titles
export const pollEditorTitle = "Editing poll";
export const pollCreatorTitle = "Creating poll";
export const allPollList = "Public polls";
export const userPollList = "My polls";

// No data found messages
export const noPublicPolls = "There aren't polls yet :(";
export const noMyPolls = "You haven't created any polls yet";
export const noPoll = "We could not fetch this poll";

// Successfull messages
export const votedSuccessfully = "Thanks for voting :)";
export const createdSuccessfully = (title) => `Successfully created poll titled: "${title}"`;
export const editedSuccessfully = (title) => `Successfully edited poll titled: "${title}"`;
export const deletedPollSuccessfully = (title) => `Successfully deleted poll titled: "${title}"`;

// Unsuccessfull messages
export const votedWrong = "Something went wrong while saving your vote :(";
export const createdWrong = (title) => `We could not create poll titled: "${title}"`;
export const editedWrong = (title) => `We could not edit poll titled: "${title}"`;
export const deletedPollWrong = (title) => `We could not delete poll titled: "${title}"`;