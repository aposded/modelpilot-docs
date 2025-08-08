# API Reference

Complete reference for the ModelPilot API and npm package.

## 📦 NPM Package API

### ModelPilot Class

The main client class for interacting with ModelPilot routers.

#### Constructor

```typescript
new ModelPilot(config: ModelPilotConfig)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `ModelPilotConfig` | Yes | Configuration object |

**ModelPilotConfig:**

```typescript
interface ModelPilotConfig {
  apiKey: string;           // Your ModelPilot API key (starts with 'mp_')
  routerId: string;         // Your router ID
  baseURL?: string;         // Custom base URL (default: 'https://api.modelpilot.ai')
  timeout?: number;         // Request timeout in milliseconds (default: 30000)
  maxRetries?: number;      // Maximum retry attempts (default: 3)
  defaultHeaders?: object;  // Custom headers to include in all requests
  debug?: boolean;          // Enable debug logging (default: false)
}
```

**Example:**

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: 'mp_your_api_key_here',
  routerId: 'your_router_id_here',
  timeout: 60000,
  maxRetries: 5
});
```

### Chat Completions

#### create()

Create a chat completion using your configured router.

```typescript
client.chat.completions.create(params: ChatCompletionCreateParams): Promise<ChatCompletion>
```

**Parameters:**

```typescript
interface ChatCompletionCreateParams {
  messages: ChatCompletionMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  tools?: ChatCompletionTool[];
  tool_choice?: 'auto' | 'none' | ChatCompletionToolChoiceOption;
  user?: string;
}
```

**ChatCompletionMessage:**

```typescript
interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ChatCompletionMessageToolCall[];
  tool_call_id?: string;
}
```

**Response:**

```typescript
interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: CompletionUsage;
  modelpilot?: ModelPilotMetadata;
}

interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

interface CompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ModelPilotMetadata {
  router_id: string;
  selected_model: string;
  selection_reason: string;
  cost_usd: number;
  latency_ms: number;
  carbon_g: number;
}
```

**Example:**

```javascript
const completion = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ],
  max_tokens: 100,
  temperature: 0.7
});

console.log(completion.choices[0].message.content);
console.log(`Cost: $${completion.modelpilot.cost_usd}`);
console.log(`Model used: ${completion.modelpilot.selected_model}`);
```

#### Streaming

For streaming responses, set `stream: true`:

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

**Stream Response:**

```typescript
interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
  modelpilot?: ModelPilotMetadata; // Only in final chunk
}

interface ChatCompletionChunkChoice {
  index: number;
  delta: {
    role?: string;
    content?: string;
    tool_calls?: ChatCompletionMessageToolCall[];
  };
  finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}
```

### Function Calling

#### Tool Definition

```typescript
interface ChatCompletionTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: object; // JSON Schema
  };
}
```

**Example:**

```javascript
const completion = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'What\'s the weather in New York?' }
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

// Check if function call was requested
const message = completion.choices[0].message;
if (message.tool_calls) {
  const toolCall = message.tool_calls[0];
  console.log('Function to call:', toolCall.function.name);
  console.log('Arguments:', toolCall.function.arguments);
}
```

### Router Information

#### getRouterConfig()

Get configuration information for your router.

```typescript
client.getRouterConfig(): Promise<RouterConfig>
```

**Response:**

```typescript
interface RouterConfig {
  id: string;
  name: string;
  mode: 'smartRouter' | 'passthrough';
  optimization: {
    costWeight: number;
    latencyWeight: number;
    qualityWeight: number;
    carbonWeight: number;
  };
  availableModels: string[];
  fallback: {
    enabled: boolean;
    retryAttempts: number;
    fallbackModels: string[];
  };
  capabilities: {
    functionCalling: boolean;
    structuredOutput: boolean;
    fileUpload: boolean;
    streaming: boolean;
  };
  requirements?: {
    maxLatencyMs?: number;
    maxCostPerToken?: number;
  };
}
```

**Example:**

```javascript
const config = await client.getRouterConfig();
console.log(`Router: ${config.name}`);
console.log(`Mode: ${config.mode}`);
console.log(`Available models: ${config.availableModels.join(', ')}`);
```

#### getModels()

Get information about available models.

```typescript
client.getModels(): Promise<ModelInfo[]>
```

**Response:**

```typescript
interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  pricing: {
    input: number;    // Cost per input token
    output: number;   // Cost per output token
  };
  limits: {
    maxTokens: number;
    contextWindow: number;
  };
  performance: {
    avgLatency: number;
    qualityScore: number;
  };
}
```

**Example:**

```javascript
const models = await client.getModels();
models.forEach(model => {
  console.log(`${model.name} (${model.provider})`);
  console.log(`  Input: $${model.pricing.input}/token`);
  console.log(`  Output: $${model.pricing.output}/token`);
});
```

## 🌐 REST API

### Authentication

All API requests require authentication using your API key in the Authorization header:

```http
Authorization: Bearer mp_your_api_key_here
```

### Base URL

```
https://api.modelpilot.ai
```

### Endpoints

#### POST /router/{routerId}

Create a chat completion using the specified router.

**Request:**

```http
POST /router/your_router_id_here
Authorization: Bearer mp_your_api_key_here
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Hello, world!"
    }
  ],
  "max_tokens": 100,
  "temperature": 0.7
}
```

**Response:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  },
  "modelpilot": {
    "router_id": "your_router_id_here",
    "selected_model": "gpt-4",
    "selection_reason": "Best quality for this request type",
    "cost_usd": 0.0012,
    "latency_ms": 1250,
    "carbon_g": 0.05
  }
}
```

#### GET /getRouterConfig

Get router configuration information.

**Request:**

```http
GET /getRouterConfig?routerId=your_router_id_here
Authorization: Bearer mp_your_api_key_here
```

**Response:**

```json
{
  "id": "your_router_id_here",
  "name": "My Smart Router",
  "mode": "smartRouter",
  "optimization": {
    "costWeight": 0.4,
    "latencyWeight": 0.3,
    "qualityWeight": 0.2,
    "carbonWeight": 0.1
  },
  "availableModels": ["gpt-4", "gpt-3.5-turbo", "claude-3"],
  "fallback": {
    "enabled": true,
    "retryAttempts": 2,
    "fallbackModels": ["gpt-3.5-turbo"]
  }
}
```

#### GET /getModels

Get available model information.

**Request:**

```http
GET /getModels?routerId=your_router_id_here
Authorization: Bearer mp_your_api_key_here
```

**Response:**

```json
[
  {
    "id": "gpt-4",
    "name": "GPT-4",
    "provider": "openai",
    "capabilities": ["chat", "functions"],
    "pricing": {
      "input": 0.03,
      "output": 0.06
    },
    "limits": {
      "maxTokens": 8192,
      "contextWindow": 128000
    }
  }
]
```

## ❌ Error Handling

### Error Response Format

```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

### Error Types

#### AuthenticationError (401)

```json
{
  "error": {
    "message": "Invalid API key format",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

#### InvalidRequestError (400)

```json
{
  "error": {
    "message": "messages is required",
    "type": "invalid_request_error",
    "code": "missing_required_parameter"
  }
}
```

#### RateLimitError (429)

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

#### APIError (500)

```json
{
  "error": {
    "message": "Internal server error",
    "type": "api_error",
    "code": "internal_error"
  }
}
```

### Error Handling in Code

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
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
    // Implement retry logic with backoff
  } else if (error instanceof InvalidRequestError) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof APIError) {
    console.error('API error:', error.status, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🔧 Configuration Options

### Request Parameters

#### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `messages` | `Array` | Required | Array of conversation messages |
| `max_tokens` | `number` | `null` | Maximum tokens to generate |
| `temperature` | `number` | `1` | Randomness (0-2) |
| `top_p` | `number` | `1` | Nucleus sampling (0-1) |
| `presence_penalty` | `number` | `0` | Presence penalty (-2 to 2) |
| `frequency_penalty` | `number` | `0` | Frequency penalty (-2 to 2) |
| `stop` | `string\|Array` | `null` | Stop sequences |
| `stream` | `boolean` | `false` | Enable streaming |
| `user` | `string` | `null` | User identifier |

#### Function Calling Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tools` | `Array` | `null` | Available tools/functions |
| `tool_choice` | `string\|object` | `'auto'` | Tool selection strategy |

### Client Configuration

#### Timeout Configuration

```javascript
const client = new ModelPilot({
  apiKey: 'your-key',
  routerId: 'your-router',
  timeout: 60000  // 60 seconds
});
```

#### Retry Configuration

```javascript
const client = new ModelPilot({
  apiKey: 'your-key',
  routerId: 'your-router',
  maxRetries: 5,
  retryDelay: 1000  // 1 second base delay
});
```

#### Custom Headers

```javascript
const client = new ModelPilot({
  apiKey: 'your-key',
  routerId: 'your-router',
  defaultHeaders: {
    'X-Custom-Header': 'value',
    'User-Agent': 'MyApp/1.0'
  }
});
```

## 📊 Response Metadata

### ModelPilot Metadata

Every response includes additional metadata about the routing decision:

```typescript
interface ModelPilotMetadata {
  router_id: string;           // Router that handled the request
  selected_model: string;      // Model that was selected
  selection_reason: string;    // Why this model was chosen
  cost_usd: number;           // Cost of the request in USD
  latency_ms: number;         // Response latency in milliseconds
  carbon_g: number;           // Carbon footprint in grams CO2
  fallback_used?: boolean;    // Whether fallback was triggered
  retry_count?: number;       // Number of retries performed
}
```

### Usage Statistics

```typescript
interface CompletionUsage {
  prompt_tokens: number;       // Input tokens
  completion_tokens: number;   // Output tokens
  total_tokens: number;        // Total tokens
}
```

## 🧪 Testing

### Mock Responses

```javascript
// For testing, you can mock the ModelPilot client
jest.mock('modelpilot', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            id: 'test-completion',
            choices: [{
              message: {
                role: 'assistant',
                content: 'Mock response'
              }
            }],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15
            },
            modelpilot: {
              router_id: 'test-router',
              selected_model: 'gpt-3.5-turbo',
              cost_usd: 0.001,
              latency_ms: 500
            }
          })
        }
      },
      getRouterConfig: jest.fn().mockResolvedValue({
        id: 'test-router',
        name: 'Test Router',
        mode: 'smartRouter'
      })
    }))
  };
});
```

## 📚 Examples

### Basic Chat

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: process.env.MODELPILOT_API_KEY,
  routerId: process.env.MODELPILOT_ROUTER_ID
});

async function basicChat() {
  const completion = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Explain quantum computing in simple terms.' }
    ]
  });

  console.log(completion.choices[0].message.content);
}
```

### Streaming Chat

```javascript
async function streamingChat() {
  const stream = await client.chat.completions.create({
    messages: [
      { role: 'user', content: 'Write a short poem about AI.' }
    ],
    stream: true
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    process.stdout.write(content);
  }

  console.log('\n\nFull response:', fullResponse);
}
```

### Function Calling

```javascript
async function functionCallingExample() {
  const completion = await client.chat.completions.create({
    messages: [
      { role: 'user', content: 'Calculate 15 * 24 + 7' }
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
    const toolCall = message.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    
    // Execute the calculation (use a safe math evaluator in production)
    const result = eval(args.expression);
    
    console.log(`Calculation: ${args.expression} = ${result}`);
  }
}
```

## 🔗 Related Documentation

- **[Getting Started](getting-started.md)** - Set up your first router
- **[NPM Package](npm-package.md)** - Complete package documentation
- **[Router Configuration](router-configuration.md)** - Advanced router setup
- **[Backend Architecture](backend-architecture.md)** - How ModelPilot works

---

**Need help?** Join our [Discord community](https://discord.gg/modelpilot) or email support@modelpilot.ai
