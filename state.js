// Create a Map to store user states
const userStates = new Map();

/**
 * Resets the state of a user by their ID.
 * @param {string} userId - The ID of the user whose state will be reset.
 */
function resetUserState(userId) {
  userStates.delete(userId); // Remove the user's state from the map
}

// Export the userStates map and the resetUserState function
module.exports = { userStates, resetUserState };