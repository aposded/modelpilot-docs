# Getting Started with ModelPilot

Welcome to ModelPilot! This guide will help you set up your first AI router and start using it in your applications.

## 🎯 What You'll Learn

- How to create and configure your first router
- How to install and use the ModelPilot npm package
- Basic concepts of intelligent AI routing
- Best practices for optimization

## 📋 Prerequisites

- A ModelPilot account ([sign up here](https://modelpilot.ai))
- Node.js 16+ for using the npm package
- Basic familiarity with AI/LLM APIs

## 🚀 Step 1: Create Your First Router

### 1.1 Access the Dashboard
1. Log in to your ModelPilot dashboard
2. Navigate to **Routers** in the sidebar
3. Click **"Create New Router"**

### 1.2 Configure Basic Settings
```
Router Name: My First Router
Mode: Smart Router (recommended for beginners)
```

### 1.3 Select Models
Choose from 100+ available models:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude-3, Claude-2
- **Google**: Gemini Pro, Gemini Flash
- **Open Source**: Llama-2, Mistral, and many more

**Tip**: Start with 3-5 models for your first router.

### 1.4 Set Optimization Preferences
Configure what matters most to your use case:

- **Cost Priority**: High (save money)
- **Latency Priority**: Medium (balanced speed)
- **Quality Priority**: High (best responses)
- **Carbon Priority**: Low (environmental impact)

### 1.5 Enable Fallback (Recommended)
```
✅ Enable Fallback
Retry Attempts: 2
Fallback Models: GPT-3.5-turbo, Claude-2
```

## 🔑 Step 2: Get Your API Key

1. Navigate to **Settings** → **API Keys**
2. Click **"Generate New API Key"**
3. Copy and securely store your API key
4. Note your Router ID from the router page

## 📦 Step 3: Install the NPM Package

```bash
npm install modelpilot
```

Or with yarn:
```bash
yarn add modelpilot
```

## 💻 Step 4: Write Your First Code

### 4.1 Basic Chat Completion

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: 'mp_your_api_key_here',
  routerId: 'your_router_id_here'
});

async function chatExample() {
  const completion = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' }
    ]
  });

  console.log(completion.choices[0].message.content);
  // Output: "The capital of France is Paris."
}

chatExample();
```

### 4.2 Streaming Response

```javascript
async function streamingExample() {
  const stream = await client.chat.completions.create({
    messages: [
      { role: 'user', content: 'Tell me a short story about a robot.' }
    ],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}

streamingExample();
```

### 4.3 Function Calling

```javascript
async function functionCallingExample() {
  const completion = await client.chat.completions.create({
    messages: [
      { role: 'user', content: 'What\'s the weather like in New York?' }
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
            }
          },
          required: ['location']
        }
      }
    }]
  });

  console.log(completion.choices[0].message);
}

functionCallingExample();
```

## 🎛️ Step 5: Understanding Router Modes

### Smart Router Mode (Recommended)
- Automatically selects the best model for each request
- Considers your optimization preferences
- Provides cost savings and performance optimization

```javascript
// No model specification needed - router decides
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### Passthrough Mode
- Always uses your specified preferred model
- Consistent behavior across all requests
- Good for testing and specific model requirements

## 📊 Step 6: Monitor Performance

### View Analytics
1. Go to your router's dashboard
2. Check the **Analytics** tab for:
   - Request volume and success rates
   - Cost breakdown by model
   - Latency metrics
   - Model selection patterns

### Key Metrics to Watch
- **Success Rate**: Should be >99%
- **Average Latency**: Varies by model and complexity
- **Cost Per Request**: Track savings over time
- **Model Distribution**: See which models are selected

## 🔧 Step 7: Optimize Your Router

### Adjust Weights Based on Usage
After running for a few days, review your analytics:

```javascript
// If cost is too high, increase cost priority
Cost Priority: Very High (0.6)
Quality Priority: Medium (0.3)
Latency Priority: Low (0.1)

// If responses are too slow, prioritize latency
Latency Priority: Very High (0.5)
Quality Priority: High (0.3)
Cost Priority: Medium (0.2)
```

### Fine-tune Model Selection
- Remove underperforming models
- Add new models that fit your use case
- Adjust fallback strategies based on failure patterns

## 🚨 Common Issues and Solutions

### Issue: High Latency
**Solution**: Increase latency priority weight, remove slow models

### Issue: High Costs
**Solution**: Increase cost priority weight, add more cost-effective models

### Issue: Poor Response Quality
**Solution**: Increase quality priority weight, add higher-quality models

### Issue: Frequent Failures
**Solution**: Enable fallback, add more reliable models to fallback list

## 🎓 Next Steps

Now that you have a working router:

1. **[Router Configuration](router-configuration.md)** - Advanced configuration options
2. **[NPM Package](npm-package.md)** - Complete package documentation
3. **[Examples](examples/)** - More code examples and use cases
4. **[API Reference](api-reference.md)** - Complete API documentation

## 💡 Best Practices

### Security
- Never commit API keys to version control
- Use environment variables for API keys
- Rotate API keys regularly

### Performance
- Use streaming for long responses
- Implement proper error handling
- Monitor and adjust router weights regularly

### Cost Optimization
- Start with cost-effective models
- Monitor usage patterns
- Adjust optimization weights based on actual usage

## 🆘 Need Help?

- **Documentation**: [docs.modelpilot.ai](https://docs.modelpilot.ai)
- **Discord Community**: [Join here](https://discord.gg/modelpilot)
- **Support Email**: support@modelpilot.ai
- **GitHub Issues**: [Report bugs](https://github.com/your-org/modelpilot/issues)

---

**Next**: [Router Configuration →](router-configuration.md)
