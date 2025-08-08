# ModelPilot NPM Package

The ModelPilot npm package provides an OpenAI-compatible interface for accessing ModelPilot's intelligent routing capabilities. Drop it into your existing OpenAI code with minimal changes!

## 📦 Installation

```bash
npm install modelpilot
```

```bash
yarn add modelpilot
```

```bash
pnpm add modelpilot
```

## 🚀 Quick Start

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: 'mp_your_api_key_here',
  routerId: 'your_router_id_here'
});

const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello, world!' }]
});

console.log(completion.choices[0].message.content);
```

## 🔧 Configuration

### Basic Configuration

```javascript
const client = new ModelPilot({
  apiKey: 'mp_your_api_key_here',    // Required: Your ModelPilot API key
  routerId: 'your_router_id_here',   // Required: Your router ID
  baseURL: 'https://api.modelpilot.ai', // Optional: Custom base URL
  timeout: 30000,                    // Optional: Request timeout in ms
  maxRetries: 3                      // Optional: Max retry attempts
});
```

### Environment Variables

```bash
# .env file
MODELPILOT_API_KEY=mp_your_api_key_here
MODELPILOT_ROUTER_ID=your_router_id_here
```

```javascript
const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});
```

## 💬 Chat Completions

### Basic Chat

```javascript
const completion = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is machine learning?' }
  ]
});

console.log(completion.choices[0].message.content);
```

### Chat with Options

```javascript
const completion = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'Write a haiku about programming' }
  ],
  max_tokens: 100,
  temperature: 0.7,
  top_p: 0.9,
  presence_penalty: 0.1,
  frequency_penalty: 0.1
});
```

### Response Format

```javascript
{
  id: "chatcmpl-abc123",
  object: "chat.completion",
  created: 1677652288,
  model: "gpt-4", // The model that was actually used
  choices: [{
    index: 0,
    message: {
      role: "assistant",
      content: "Hello! How can I help you today?"
    },
    finish_reason: "stop"
  }],
  usage: {
    prompt_tokens: 12,
    completion_tokens: 9,
    total_tokens: 21
  },
  // ModelPilot-specific metadata
  modelpilot: {
    router_id: "your_router_id",
    selected_model: "gpt-4",
    selection_reason: "Best quality for this request type",
    cost_usd: 0.0012,
    latency_ms: 1250,
    carbon_g: 0.05
  }
}
```

## 🌊 Streaming

### Basic Streaming

```javascript
const stream = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### Streaming with Error Handling

```javascript
async function streamWithErrorHandling() {
  try {
    const stream = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Count to 10' }],
      stream: true
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      process.stdout.write(content);
    }

    console.log('\n\nFull response:', fullContent);
  } catch (error) {
    console.error('Streaming error:', error);
  }
}
```

### Stream Response Format

```javascript
// Each chunk looks like:
{
  id: "chatcmpl-abc123",
  object: "chat.completion.chunk",
  created: 1677652288,
  model: "gpt-4",
  choices: [{
    index: 0,
    delta: {
      content: "Hello"  // Incremental content
    },
    finish_reason: null
  }]
}

// Final chunk:
{
  id: "chatcmpl-abc123",
  object: "chat.completion.chunk",
  created: 1677652288,
  model: "gpt-4",
  choices: [{
    index: 0,
    delta: {},
    finish_reason: "stop"
  }],
  // ModelPilot metadata in final chunk
  modelpilot: {
    router_id: "your_router_id",
    selected_model: "gpt-4",
    total_cost_usd: 0.0012,
    total_latency_ms: 2500
  }
}
```

## 🛠️ Function Calling

### Basic Function Calling

```javascript
const completion = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'What\'s the weather in San Francisco?' }
  ],
  tools: [{
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit'
          }
        },
        required: ['location']
      }
    }
  }],
  tool_choice: 'auto'
});

// Check if the model wants to call a function
const message = completion.choices[0].message;
if (message.tool_calls) {
  console.log('Function call requested:', message.tool_calls[0]);
}
```

### Function Calling with Execution

```javascript
async function handleFunctionCalling() {
  const completion = await client.chat.completions.create({
    messages: [
      { role: 'user', content: 'What\'s 15 * 24?' }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'calculate',
        description: 'Perform mathematical calculations',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Mathematical expression to evaluate'
            }
          },
          required: ['expression']
        }
      }
    }]
  });

  const message = completion.choices[0].message;
  
  if (message.tool_calls) {
    // Execute the function
    const toolCall = message.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    const result = eval(args.expression); // In production, use a safe math evaluator

    // Send the result back
    const followUp = await client.chat.completions.create({
      messages: [
        { role: 'user', content: 'What\'s 15 * 24?' },
        message, // Include the assistant's message with tool calls
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result.toString()
        }
      ],
      tools: [/* same tools */]
    });

    console.log(followUp.choices[0].message.content);
  }
}
```

## 📊 Router Information

### Get Router Configuration

```javascript
const config = await client.getRouterConfig();
console.log(config);

// Response:
{
  id: "your_router_id",
  name: "My Smart Router",
  mode: "smartRouter",
  optimization: {
    costWeight: 0.4,
    latencyWeight: 0.3,
    qualityWeight: 0.2,
    carbonWeight: 0.1
  },
  availableModels: ["gpt-4", "gpt-3.5-turbo", "claude-3"],
  fallback: {
    enabled: true,
    retryAttempts: 2,
    fallbackModels: ["gpt-3.5-turbo"]
  }
}
```

### Get Available Models

```javascript
const models = await client.getModels();
console.log(models);

// Response:
[
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    capabilities: ["chat", "functions"],
    pricing: {
      input: 0.03,
      output: 0.06
    }
  },
  // ... more models
]
```

## ❌ Error Handling

### Error Types

```javascript
import { 
  ModelPilotError,
  APIError,
  AuthenticationError,
  RateLimitError,
  InvalidRequestError 
} from 'modelpilot';

try {
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello' }]
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof InvalidRequestError) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof APIError) {
    console.error('API error:', error.status, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Logic

```javascript
async function chatWithRetry(messages, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({ messages });
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      if (error instanceof RateLimitError) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error; // Don't retry non-rate-limit errors
      }
    }
  }
}
```

## 🔄 Migration from OpenAI

### Before (OpenAI)

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

### After (ModelPilot)

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});

const completion = await client.chat.completions.create({
  // No model needed - router selects automatically
  messages: [{ role: 'user', content: 'Hello' }]
});
```

### Migration Benefits

- **Cost Savings**: Up to 70% reduction in API costs
- **Better Performance**: Automatic model selection for optimal latency
- **Reliability**: Built-in fallback and retry logic
- **Analytics**: Detailed usage and performance metrics
- **Future-Proof**: Access to 100+ models without code changes

## 🔧 Advanced Configuration

### Custom Headers

```javascript
const client = new ModelPilot({
  apiKey: 'your-api-key',
  routerId: 'your-router-id',
  defaultHeaders: {
    'X-Custom-Header': 'value',
    'User-Agent': 'MyApp/1.0'
  }
});
```

### Request Interceptors

```javascript
// Add request logging
client.axios.interceptors.request.use(request => {
  console.log('Making request:', request.method, request.url);
  return request;
});

// Add response logging
client.axios.interceptors.response.use(response => {
  console.log('Response received:', response.status);
  return response;
});
```

### Custom Base URL

```javascript
const client = new ModelPilot({
  apiKey: 'your-api-key',
  routerId: 'your-router-id',
  baseURL: 'https://your-custom-domain.com'
});
```

## 📝 TypeScript Support

### Type Definitions

```typescript
import ModelPilot, { 
  ChatCompletion, 
  ChatCompletionChunk,
  ChatCompletionCreateParams 
} from 'modelpilot';

const client = new ModelPilot({
  apiKey: 'your-api-key',
  routerId: 'your-router-id'
});

const params: ChatCompletionCreateParams = {
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 100,
  temperature: 0.7
};

const completion: ChatCompletion = await client.chat.completions.create(params);
```

### Custom Types

```typescript
interface MyAppMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

function convertMessages(messages: MyAppMessage[]): ChatCompletionCreateParams['messages'] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}
```

## 🧪 Testing

### Mocking for Tests

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.js']
};

// src/test-setup.js
import { jest } from '@jest/globals';

// Mock the entire modelpilot module
jest.mock('modelpilot', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                role: 'assistant',
                content: 'Mocked response'
              }
            }]
          })
        }
      }
    }))
  };
});
```

### Test Example

```javascript
import ModelPilot from 'modelpilot';

describe('Chat functionality', () => {
  let client;

  beforeEach(() => {
    client = new ModelPilot({
      apiKey: 'test-key',
      routerId: 'test-router'
    });
  });

  it('should create chat completion', async () => {
    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }]
    });

    expect(completion.choices[0].message.content).toBe('Mocked response');
  });
});
```

## 📊 Performance Tips

### Optimize for Cost

```javascript
// Use streaming for long responses to see results faster
const stream = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Write a long essay' }],
  stream: true
});

// Set reasonable max_tokens to avoid unnecessary costs
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Short answer please' }],
  max_tokens: 50
});
```

### Optimize for Latency

```javascript
// Use lower temperature for faster, more deterministic responses
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Quick question' }],
  temperature: 0.1
});
```

### Batch Requests

```javascript
// Process multiple requests concurrently
const requests = [
  'What is AI?',
  'What is ML?',
  'What is DL?'
].map(content => 
  client.chat.completions.create({
    messages: [{ role: 'user', content }]
  })
);

const results = await Promise.all(requests);
```

## 🆘 Troubleshooting

### Common Issues

**Issue**: `Invalid API key format`
```javascript
// Solution: Ensure API key starts with 'mp_'
const client = new ModelPilot({
  apiKey: 'mp_your_actual_key_here' // Must start with 'mp_'
});
```

**Issue**: `Router not found`
```javascript
// Solution: Verify router ID in dashboard
const client = new ModelPilot({
  routerId: 'router_abc123' // Check this ID in your dashboard
});
```

**Issue**: `Request timeout`
```javascript
// Solution: Increase timeout for long requests
const client = new ModelPilot({
  timeout: 60000 // 60 seconds
});
```

### Debug Mode

```javascript
// Enable debug logging
const client = new ModelPilot({
  apiKey: 'your-key',
  routerId: 'your-router',
  debug: true // Enables detailed logging
});
```

## 📚 Examples

Check out the [examples directory](examples/) for complete working examples:

- [Basic Chat Bot](examples/basic-chatbot.js)
- [Streaming Chat](examples/streaming-chat.js)
- [Function Calling](examples/function-calling.js)
- [Error Handling](examples/error-handling.js)
- [TypeScript Usage](examples/typescript-example.ts)

## 🔗 Related Documentation

- **[Getting Started](getting-started.md)** - Set up your first router
- **[Router Configuration](router-configuration.md)** - Advanced router setup
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Backend Architecture](backend-architecture.md)** - How ModelPilot works

---

**Need help?** Join our [Discord community](https://discord.gg/modelpilot) or email support@modelpilot.ai
