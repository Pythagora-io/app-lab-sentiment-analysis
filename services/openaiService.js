const OpenAI = require('openai');

async function analyzeFeedback(feedbackText, userId, apiKey) {
  const openai = new OpenAI({ apiKey });

  const systemMessage = `You are an AI assistant trained to analyze customer feedback. Your task is to extract key information from the feedback, including topics, trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, and potential room for improvement.`;

  const userPrompt = `Please analyze the following customer feedback and provide a structured response:

${feedbackText}

Include sections for:
1. Topics
2. Trends
3. Pain Points
4. Experiences
5. Behaviors
6. Objections
7. Desires
8. Interests
9. Frequent Questions
10. Product Clarity
11. Psychographics
12. Potential Room for Improvement`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
    });

    console.log('OpenAI API response:', completion.choices[0].message.content);

    try {
      const parsedResponse = JSON.parse(completion.choices[0].message.content);
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing OpenAI API response to JSON:', parseError);
      return { rawResponse: completion.choices[0].message.content };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function generateSummary(analysisArray, userApiKey, selectedEmotions) {
  console.log('Generating summary');
  console.log('Selected emotions:', selectedEmotions);
  try {
    const openai = new OpenAI({ apiKey: userApiKey });

    let emotionPrompt = '';
    if (selectedEmotions && selectedEmotions.length > 0) {
      emotionPrompt = `Additionally, perform an emotion analysis for the following emotions: ${selectedEmotions.join(', ')}. Rate the intensity of each emotion on a scale of 0-10 for the overall feedback.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that summarizes multiple feedback analyses. Respond with a JSON object containing the following top-level keys: key trends, pain points, experiences, behaviors, objections, desires, interests, frequent questions, product clarity, psychographics, potential room for improvement${selectedEmotions.length > 0 ? ', emotion_analysis' : ''}. Each key should have an array value. If there's not enough information for a category, provide an empty array. Do not nest categories within other categories. Do not include any Markdown formatting in your response.`
        },
        {
          role: "user",
          content: `Summarize the following feedback analyses: ${JSON.stringify(analysisArray)} ${emotionPrompt}`
        }
      ],
      max_tokens: 1000
    });

    console.log('OpenAI API response:', response.choices[0].message.content);

    try {
      const rawSummary = JSON.parse(response.choices[0].message.content);
      console.log('Parsed summary:', JSON.stringify(rawSummary, null, 2));
      return rawSummary;
    } catch (parseError) {
      console.error('Error parsing summary to JSON:', parseError);
      return { rawSummary: response.choices[0].message.content };
    }
  } catch (error) {
    console.error('Error generating summary:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

module.exports = { analyzeFeedback, generateSummary };