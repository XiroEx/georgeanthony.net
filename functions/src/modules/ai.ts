/**
 * Fetches the top 5 financial news headlines by combining Google Custom Search and OpenAI API.
 *
 * @param {string} googleApiKey - The API key for authenticating with the Google API.
 * @param {string} cx - The Custom Search Engine ID for Google Custom Search.
 * @param {string} openAiApiKey - The API key for authenticating with the OpenAI API.
 * @param {string} [searchQuery] - An optional search query to filter the financial news.
 * @return {Promise<string>} A promise that resolves to a string containing the top 5 financial news headlines,
 * summarized and formatted by OpenAI, separated by ' | '.
 *
 * @throws {Error} Throws an error if the API request fails or if the response is invalid.
 */
export async function getTopFinancialNews(
  googleApiKey: string,
  cx: string,
  openAiApiKey: string,
  searchQuery?: string
): Promise<string> {
  const googleEndpoint = "https://www.googleapis.com/customsearch/v1";
  const openAiEndpoint = "https://api.openai.com/v1/chat/completions";

  try {
    // Step 1: Fetch financial news from Google Custom Search
    const googleQueryParams = new URLSearchParams({
      key: googleApiKey,
      cx,
      q: searchQuery || "financial news",
      num: "10", // Fetch up to 10 results for better context
    });

    const googleResponse = await fetch(`${googleEndpoint}?${googleQueryParams.toString()}`);
    if (!googleResponse.ok) {
      throw new Error(`Failed to fetch financial news from Google: ${googleResponse.statusText}`);
    }

    const googleData = await googleResponse.json() as {
      items: { title: string, snippet: string }[];
    };

    // Extract titles and snippets for context
    const newsItems = googleData.items.map((item) => `${item.title}: ${item.snippet}`).join("\n");

    // Step 2: Use OpenAI to summarize and format the news
    const openAiResponse = await fetch(openAiEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial news assistant. Summarize and format the following news into 5 concise headlines for a ticker tape. Each headline should be separated by ' | '.",
          },
          {
            role: "user",
            content: `Here are the latest financial news stories:\n${newsItems}`,
          },
        ],
        max_tokens: 500, // Use more tokens for detailed processing
        temperature: 0.7,
      }),
    });

    if (!openAiResponse.ok) {
      throw new Error(`Failed to process financial news with OpenAI: ${openAiResponse.statusText}`);
    }

    const openAiData = await openAiResponse.json() as {
      choices: { message: { content: string } }[];
    };

    const headlines = openAiData.choices[0].message.content.trim();
    return headlines;
  } catch (error) {
    console.error("Error fetching and processing financial news:", error);
    throw new Error("Failed to fetch and process financial news.");
  }
}
