// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Create an array to store the conversation history
let messages = [
  {
    role: 'system', content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

    If a user's query is unrelated to budget travel, respond by stating that you do not know.`}
];

// Listen for the form submission and call sendMessage
chatForm.addEventListener('submit', async (event) =>{
  event.preventDefault(); // Prevent the page from reloading
  responseContainer.textContent = 'Thinking...'; // Show a loading message

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userInput.value });

  // Use try/catch to handle errors
  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', // We are POST-ing data to the API
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
      },
      // Send the model and the full conversation history
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_completion_tokens: 800,
        temperature: 0.5,
        frequency_penalty: 0.8
      })
    });

    // Parse and store the response data
    const result = await response.json();

    // Check if the response is valid and has the expected data
    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
      // Get the AI's response text
      const aiResponse = result.choices[0].message.content;

      // Add the AI's response to the conversation history
      messages.push({
        role: 'assistant',
        content: aiResponse
      });

      // Display the response on the page
      responseContainer.textContent = aiResponse;
    } else {
      // If the response is not as expected, show an error message
      responseContainer.textContent = 'Sorry, something went wrong. Please try again.';
      console.error('Unexpected API response:', result);
    }
  } catch (error) {
    // If there is a network or other error, show an error message
    responseContainer.textContent = 'Sorry, there was a problem connecting to the server.';
    console.error('API request error:', error);
  }

  // Clear the input field after sending the message
  userInput.value = '';
});