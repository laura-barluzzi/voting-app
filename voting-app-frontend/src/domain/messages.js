// No data found messages
export const noPublicPolls = "There aren't polls yet :(";
export const noMyPolls = "You haven't created any polls yet";
export const noPoll = "This poll is not currently available";

// Header messages
export const header = {
  loggedOut: "Join and create personalized polls",
  loggedIn: (name) => `Welcome ${name}`
};

// Page titles
export const titlePages = {
  pollsList: "Public polls",
  userPolls: "My polls",
  pollCreator: "Creating poll",
  pollEditor: "Editing poll"
};

// Successfull messages
export const success = {
  voting: "Thanks for voting :)",
  creating: (title) => `Successfully created poll titled: "${title}"`,
  editing: (title) => `Successfully edited poll titled: "${title}"`,
  saving: "The poll was successfully saved :)",
  deleting: (title) => `Successfully deleted poll titled: "${title}"`,
  clipboard: "Url copied to clipboard successfully"
};

// Error messages
export const failure = {
  voting: "Error: Something went wrong while saving your vote, please try again",
  creating: "Error: Something went wrong while creating the poll",
  editing: (title) => `Error: Something went wrong while editing poll titled: "${title}"`,
  deleting: "Error: Something went wrong while deleting poll",
  fetchingPolls: "Error: Something went wrong while fetching the polls",
  fetchingPoll: "Error: Something went wrong while fetching this poll"
};

// Button texts
export const btn = {
  save : "Save",
  edit : "Edit",
  add : "Add option",
  remove: "\u00d7",
  vote: "Vote",
  create: "Create poll",
  myPolls: "My polls",
  login: "Login",
  logout: "Logout",
  home: "Home",
  clipboard: "Copy to clipboard",
  styles: {
    red: "danger",
    blu: "primary",
    ligthBlu: "info"
  }
};