const generateResponse = async (message) => {
  return `You said: ${message}`;
};

module.exports = { generateResponse };