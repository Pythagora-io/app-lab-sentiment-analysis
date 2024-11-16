const OpenAI = require('openai');

async function validateOpenAIKey(apiKey) {
  try {
    const openai = new OpenAI({ apiKey: apiKey });
    await openai.models.list();
    console.log('OpenAI API key validation successful.');
    return true;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    console.error('Error stack:', error.stack);
    return false;
  }
}

module.exports = { validateOpenAIKey };