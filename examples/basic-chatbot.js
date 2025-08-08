/**
 * Basic Chatbot Example
 * 
 * This example demonstrates the simplest way to use ModelPilot
 * for creating a basic chatbot with conversation memory.
 */

import ModelPilot from 'modelpilot';
import readline from 'readline';

// Initialize ModelPilot client
const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});

// Conversation history
const conversation = [
  {
    role: 'system',
    content: 'You are a helpful and friendly assistant. Keep responses concise but informative.'
  }
];

// Set up readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatBot() {
  console.log('🤖 ModelPilot Chatbot');
  console.log('Type "exit" to quit\n');

  while (true) {
    // Get user input
    const userInput = await new Promise(resolve => {
      rl.question('You: ', resolve);
    });

    // Check for exit command
    if (userInput.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      break;
    }

    // Add user message to conversation
    conversation.push({
      role: 'user',
      content: userInput
    });

    try {
      // Get response from ModelPilot
      const completion = await client.chat.completions.create({
        messages: conversation,
        max_tokens: 150,
        temperature: 0.7
      });

      const assistantMessage = completion.choices[0].message.content;
      
      // Add assistant response to conversation
      conversation.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Display response with metadata
      console.log(`\n🤖 Assistant: ${assistantMessage}`);
      console.log(`\n📊 Model: ${completion.modelpilot.selected_model}`);
      console.log(`💰 Cost: $${completion.modelpilot.cost_usd.toFixed(6)}`);
      console.log(`⚡ Latency: ${completion.modelpilot.latency_ms}ms\n`);

    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('Please try again.\n');
    }
  }

  rl.close();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Start the chatbot
chatBot().catch(console.error);
