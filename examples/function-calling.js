/**
 * Function Calling Example
 * 
 * This example demonstrates how to use ModelPilot's function calling capabilities
 * to create AI agents that can interact with external tools and APIs.
 */

import ModelPilot from 'modelpilot';

// Initialize ModelPilot client
const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});

// Mock external APIs for demonstration
const weatherAPI = {
  async getCurrentWeather(location, unit = 'celsius') {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const temperatures = {
      'new york': { celsius: 22, fahrenheit: 72 },
      'london': { celsius: 15, fahrenheit: 59 },
      'tokyo': { celsius: 28, fahrenheit: 82 },
      'sydney': { celsius: 18, fahrenheit: 64 }
    };
    
    const temp = temperatures[location.toLowerCase()] || { celsius: 20, fahrenheit: 68 };
    return {
      location,
      temperature: temp[unit],
      unit,
      condition: 'Partly cloudy',
      humidity: 65,
      windSpeed: 12
    };
  }
};

const calculatorAPI = {
  calculate(expression) {
    try {
      // In production, use a safe math evaluator
      const result = eval(expression);
      return { expression, result, valid: true };
    } catch (error) {
      return { expression, error: error.message, valid: false };
    }
  }
};

const stockAPI = {
  async getStockPrice(symbol) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockPrices = {
      'AAPL': 175.50,
      'GOOGL': 142.30,
      'MSFT': 378.90,
      'TSLA': 248.75,
      'AMZN': 155.20
    };
    
    return {
      symbol: symbol.toUpperCase(),
      price: mockPrices[symbol.toUpperCase()] || 100.00,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5
    };
  }
};

// Define available tools
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather information for a specific location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name (e.g., "New York", "London")'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit',
            default: 'celsius'
          }
        },
        required: ['location']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Mathematical expression to evaluate (e.g., "2 + 2", "Math.sqrt(16)")'
          }
        },
        required: ['expression']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_stock_price',
      description: 'Get current stock price for a given symbol',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Stock symbol (e.g., "AAPL", "GOOGL")'
          }
        },
        required: ['symbol']
      }
    }
  }
];

// Function execution handler
async function executeFunction(functionName, args) {
  console.log(`🔧 Executing function: ${functionName}`);
  console.log(`📝 Arguments:`, args);
  
  try {
    let result;
    
    switch (functionName) {
      case 'get_weather':
        result = await weatherAPI.getCurrentWeather(args.location, args.unit);
        break;
      case 'calculate':
        result = calculatorAPI.calculate(args.expression);
        break;
      case 'get_stock_price':
        result = await stockAPI.getStockPrice(args.symbol);
        break;
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
    
    console.log(`✅ Function result:`, result);
    return result;
    
  } catch (error) {
    console.error(`❌ Function execution error:`, error.message);
    return { error: error.message };
  }
}

// Main function calling example
async function functionCallingExample() {
  console.log('🛠️  ModelPilot Function Calling Example\n');
  
  const testQueries = [
    "What's the weather like in New York?",
    "Calculate 15 * 24 + 7",
    "What's the current stock price of Apple?",
    "What's the weather in London in Fahrenheit and also calculate the square root of 144?",
    "Get me the stock price for Tesla and Google, then calculate which one is higher"
  ];
  
  for (const query of testQueries) {
    console.log(`\n🗣️  User: ${query}`);
    await processQuery(query);
    console.log('\n' + '─'.repeat(80));
  }
}

async function processQuery(userMessage) {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant with access to weather, calculator, and stock price tools. Use the appropriate tools to answer user questions accurately.'
    },
    {
      role: 'user',
      content: userMessage
    }
  ];
  
  try {
    // Initial completion with tools
    const completion = await client.chat.completions.create({
      messages,
      tools,
      tool_choice: 'auto',
      max_tokens: 500
    });
    
    const message = completion.choices[0].message;
    messages.push(message);
    
    // Check if the model wants to call functions
    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log(`🤖 Assistant wants to call ${message.tool_calls.length} function(s):`);
      
      // Execute all requested functions
      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        // Execute the function
        const functionResult = await executeFunction(functionName, args);
        
        // Add function result to conversation
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(functionResult)
        });
      }
      
      // Get final response with function results
      const finalCompletion = await client.chat.completions.create({
        messages,
        tools,
        max_tokens: 300
      });
      
      const finalMessage = finalCompletion.choices[0].message.content;
      console.log(`\n🤖 Assistant: ${finalMessage}`);
      
      // Show metadata
      console.log(`\n📊 Total cost: $${(completion.modelpilot.cost_usd + finalCompletion.modelpilot.cost_usd).toFixed(6)}`);
      console.log(`⚡ Total latency: ${completion.modelpilot.latency_ms + finalCompletion.modelpilot.latency_ms}ms`);
      
    } else {
      // No function calls needed
      console.log(`🤖 Assistant: ${message.content}`);
      console.log(`\n📊 Cost: $${completion.modelpilot.cost_usd.toFixed(6)}`);
      console.log(`⚡ Latency: ${completion.modelpilot.latency_ms}ms`);
    }
    
  } catch (error) {
    console.error('❌ Error processing query:', error.message);
  }
}

// Interactive function calling demo
async function interactiveFunctionCalling() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('🛠️  Interactive Function Calling Demo');
  console.log('Available functions: weather, calculator, stock prices');
  console.log('Type "exit" to quit\n');
  
  while (true) {
    const userInput = await new Promise(resolve => {
      rl.question('You: ', resolve);
    });
    
    if (userInput.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      break;
    }
    
    await processQuery(userInput);
    console.log();
  }
  
  rl.close();
}

// Advanced multi-step function calling
async function multiStepExample() {
  console.log('🔄 Multi-Step Function Calling Example\n');
  
  const query = "I'm planning a trip to New York and London. Can you tell me the weather in both cities, and also calculate how much I'd save if I find flights that are 20% cheaper than the current $800 total?";
  
  console.log(`🗣️  User: ${query}`);
  
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful travel assistant. Use available tools to provide comprehensive information.'
    },
    {
      role: 'user',
      content: query
    }
  ];
  
  let stepCount = 1;
  let totalCost = 0;
  let totalLatency = 0;
  
  while (true) {
    console.log(`\n📍 Step ${stepCount}:`);
    
    const completion = await client.chat.completions.create({
      messages,
      tools,
      tool_choice: 'auto',
      max_tokens: 400
    });
    
    const message = completion.choices[0].message;
    messages.push(message);
    
    totalCost += completion.modelpilot.cost_usd;
    totalLatency += completion.modelpilot.latency_ms;
    
    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log(`🔧 Executing ${message.tool_calls.length} function(s)...`);
      
      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        const functionResult = await executeFunction(functionName, args);
        
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(functionResult)
        });
      }
      
      stepCount++;
    } else {
      // Final response
      console.log(`\n🤖 Final Response: ${message.content}`);
      break;
    }
    
    // Safety check to prevent infinite loops
    if (stepCount > 5) {
      console.log('\n⚠️  Maximum steps reached');
      break;
    }
  }
  
  console.log(`\n📊 Multi-step Summary:`);
  console.log(`   Total steps: ${stepCount}`);
  console.log(`   Total cost: $${totalCost.toFixed(6)}`);
  console.log(`   Total latency: ${totalLatency}ms`);
}

// Choose which example to run
const args = process.argv.slice(2);

if (args.includes('--interactive')) {
  interactiveFunctionCalling().catch(console.error);
} else if (args.includes('--multi-step')) {
  multiStepExample().catch(console.error);
} else {
  functionCallingExample().catch(console.error);
}

// Usage:
// node function-calling.js              # Basic examples
// node function-calling.js --interactive # Interactive demo
// node function-calling.js --multi-step  # Multi-step example
