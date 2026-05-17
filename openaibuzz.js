const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(prompt) {
  const response = await client.responses.create({
    model: "gpt-5.5",
    input: prompt,
  });

  return response.output_text;
}

module.exports = askAI;