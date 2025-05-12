/**
 * Fetches the top 5 financial news headlines using the OpenAI API.
 *
 * @param {string} apiKey - The API key for authenticating with the OpenAI API.
 * @return {Promise<string>} A promise that resolves to a string containing the top 5 financial news headlines,
 * separated by ' | '.
 *
 * @throws {Error} Throws an error if the API request fails or if the response is invalid.
 */
export async function getTopFinancialNews(apiKey: string): Promise<string> {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a financial news assistant.",
          },
          {
            role: "user",
            content: "Provide the top 5 financial news stories currently, presented as headlines for a ticker tape. Each story should be separated by ' | '.",
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch financial news: ${response.statusText}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    const headlines = data.choices[0].message.content.trim();
    return headlines;
  } catch (error) {
    console.error("Error fetching financial news:", error);
    throw new Error("Failed to fetch financial news.");
  }
}
