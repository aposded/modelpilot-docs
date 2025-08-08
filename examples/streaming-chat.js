/**
 * Streaming Chat Example
 * 
 * This example demonstrates how to use ModelPilot's streaming capabilities
 * for real-time response generation, perfect for chat applications.
 */

import ModelPilot from 'modelpilot';
import readline from 'readline';

// Initialize ModelPilot client
const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});

// Set up readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function streamingChat() {
  console.log('🌊 ModelPilot Streaming Chat');
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

    try {
      console.log('\n🤖 Assistant: ');
      
      // Create streaming completion
      const stream = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Provide detailed and engaging responses.'
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.8
      });

      let fullResponse = '';
      let startTime = Date.now();

      // Process streaming chunks
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        
        if (content) {
          fullResponse += content;
          process.stdout.write(content);
        }

        // Check if this is the final chunk with metadata
        if (chunk.modelpilot) {
          const endTime = Date.now();
          const totalTime = endTime - startTime;
          
          console.log('\n');
          console.log(`\n📊 Stream completed:`);
          console.log(`   Model: ${chunk.modelpilot.selected_model}`);
          console.log(`   Cost: $${chunk.modelpilot.total_cost_usd.toFixed(6)}`);
          console.log(`   Total time: ${totalTime}ms`);
          console.log(`   Server latency: ${chunk.modelpilot.total_latency_ms}ms`);
          console.log(`   Characters: ${fullResponse.length}`);
          console.log(`   Streaming rate: ${(fullResponse.length / (totalTime / 1000)).toFixed(1)} chars/sec\n`);
        }
      }

    } catch (error) {
      console.error('\n❌ Streaming error:', error.message);
      console.log('Please try again.\n');
    }
  }

  rl.close();
}

// Advanced streaming example with progress indicators
async function advancedStreamingExample() {
  console.log('🚀 Advanced Streaming Example\n');

  const messages = [
    {
      role: 'user',
      content: 'Write a detailed explanation of how neural networks work, including the mathematical concepts.'
    }
  ];

  try {
    const stream = await client.chat.completions.create({
      messages,
      stream: true,
      max_tokens: 1000,
      temperature: 0.7
    });

    let fullResponse = '';
    let chunkCount = 0;
    let wordCount = 0;
    const startTime = Date.now();

    console.log('🤖 Generating response...\n');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        fullResponse += content;
        chunkCount++;
        
        // Count words (approximate)
        const words = content.split(/\s+/).filter(word => word.length > 0);
        wordCount += words.length;
        
        // Write content
        process.stdout.write(content);
        
        // Show progress every 50 chunks
        if (chunkCount % 50 === 0) {
          const elapsed = Date.now() - startTime;
          const rate = (fullResponse.length / (elapsed / 1000)).toFixed(1);
          process.stdout.write(`\n[Progress: ${chunkCount} chunks, ${rate} chars/sec]\n`);
        }
      }

      // Final chunk with metadata
      if (chunk.modelpilot) {
        const totalTime = Date.now() - startTime;
        
        console.log('\n\n📈 Streaming Statistics:');
        console.log(`   Total chunks: ${chunkCount}`);
        console.log(`   Total characters: ${fullResponse.length}`);
        console.log(`   Estimated words: ${wordCount}`);
        console.log(`   Streaming time: ${totalTime}ms`);
        console.log(`   Average rate: ${(fullResponse.length / (totalTime / 1000)).toFixed(1)} chars/sec`);
        console.log(`   Model used: ${chunk.modelpilot.selected_model}`);
        console.log(`   Total cost: $${chunk.modelpilot.total_cost_usd.toFixed(6)}`);
      }
    }

  } catch (error) {
    console.error('❌ Advanced streaming error:', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Choose which example to run
const args = process.argv.slice(2);
if (args.includes('--advanced')) {
  advancedStreamingExample().catch(console.error);
} else {
  streamingChat().catch(console.error);
}

// Usage:
// node streaming-chat.js              # Interactive streaming chat
// node streaming-chat.js --advanced   # Advanced streaming demo
