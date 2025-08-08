# Router Configuration Guide

Learn how to configure ModelPilot routers for optimal performance, cost savings, and reliability.

## 🎯 Overview

ModelPilot routers intelligently select the best AI model for each request based on your optimization preferences. This guide covers advanced configuration options and best practices.

## 🧠 Router Modes

### Smart Router Mode (Recommended)

Smart Router mode automatically selects the optimal model for each request based on your configured weights and requirements.

```javascript
// Router automatically selects the best model
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Analyze this data...' }]
  // No model specified - router decides
});
```

**Benefits:**
- Automatic cost optimization
- Performance-based selection
- Quality-aware routing
- Carbon footprint consideration

**Best for:**
- Production applications
- Cost-sensitive workloads
- Variable request types
- Long-term optimization

### Passthrough Mode

Passthrough mode always routes requests to your specified preferred model, providing consistent behavior.

```javascript
// Always uses the configured preferred model
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello' }]
  // Uses preferred model (e.g., gpt-4)
});
```

**Benefits:**
- Predictable behavior
- Consistent response style
- Simple debugging
- Model-specific features

**Best for:**
- Testing and development
- Model-specific requirements
- Consistent user experience
- Compliance requirements

## ⚖️ Optimization Weights

Configure how the router prioritizes different factors when selecting models.

### Weight Configuration

```javascript
{
  costWeight: 0.4,      // 40% - Cost optimization
  latencyWeight: 0.3,   // 30% - Speed optimization  
  qualityWeight: 0.2,   // 20% - Response quality
  carbonWeight: 0.1     // 10% - Environmental impact
}
// Total must equal 1.0
```

### Priority Levels

| Priority | Weight | Description |
|----------|--------|-------------|
| Very High | 0.5-0.7 | Dominant factor in selection |
| High | 0.3-0.4 | Major consideration |
| Medium | 0.2-0.3 | Moderate influence |
| Low | 0.1-0.2 | Minor factor |

### Common Configurations

#### Cost-Optimized (Startups/High Volume)
```javascript
{
  costWeight: 0.6,      // Primary focus on cost savings
  qualityWeight: 0.25,  // Maintain reasonable quality
  latencyWeight: 0.1,   // Speed less important
  carbonWeight: 0.05    // Minimal environmental focus
}
```

#### Performance-Optimized (Real-time Apps)
```javascript
{
  latencyWeight: 0.5,   // Speed is critical
  qualityWeight: 0.3,   // Good quality needed
  costWeight: 0.15,     // Cost secondary
  carbonWeight: 0.05    // Environmental consideration
}
```

#### Quality-Optimized (Content Creation)
```javascript
{
  qualityWeight: 0.5,   // Best possible responses
  costWeight: 0.25,     // Reasonable cost control
  latencyWeight: 0.2,   // Acceptable speed
  carbonWeight: 0.05    // Environmental awareness
}
```

#### Balanced (General Purpose)
```javascript
{
  costWeight: 0.3,      // Moderate cost focus
  qualityWeight: 0.3,   // Good quality
  latencyWeight: 0.25,  // Reasonable speed
  carbonWeight: 0.15    // Environmental responsibility
}
```

## 🎯 Model Selection

### Available Models

ModelPilot supports 100+ models across multiple providers:

#### OpenAI Models
- **GPT-4**: Highest quality, higher cost
- **GPT-4 Turbo**: Balanced quality and speed
- **GPT-3.5 Turbo**: Fast and cost-effective

#### Anthropic Models
- **Claude-3 Opus**: Premium quality
- **Claude-3 Sonnet**: Balanced performance
- **Claude-3 Haiku**: Fast and efficient

#### Google Models
- **Gemini Pro**: High-quality reasoning
- **Gemini Flash**: Fast responses

#### Open Source Models
- **Llama-2**: Cost-effective, privacy-focused
- **Mistral**: European, GDPR-compliant
- **CodeLlama**: Specialized for code

### Model Selection Strategy

```javascript
// Recommended starter set (3-5 models)
availableModels: [
  'gpt-4',              // High quality
  'gpt-3.5-turbo',      // Cost effective
  'claude-3-sonnet',    // Alternative high quality
  'gemini-pro',         // Google's offering
  'llama-2-70b'         // Open source option
]
```

### Model Categories by Use Case

#### Code Generation
```javascript
recommendedModels: [
  'gpt-4',              // Best for complex code
  'claude-3-sonnet',    // Good reasoning
  'codellama-34b',      // Specialized for code
  'gpt-3.5-turbo'       // Fast iterations
]
```

#### Content Writing
```javascript
recommendedModels: [
  'gpt-4',              // Creative writing
  'claude-3-opus',      // Long-form content
  'gemini-pro',         // Research-based content
  'mistral-large'       // European compliance
]
```

#### Data Analysis
```javascript
recommendedModels: [
  'gpt-4',              // Complex analysis
  'claude-3-sonnet',    // Structured thinking
  'gemini-pro',         // Mathematical reasoning
  'gpt-3.5-turbo'       // Quick insights
]
```

#### Customer Support
```javascript
recommendedModels: [
  'gpt-3.5-turbo',      // Fast responses
  'claude-3-haiku',     // Efficient handling
  'gemini-flash',       // Quick turnaround
  'llama-2-13b'         // Cost-effective
]
```

## 🛡️ Fallback Configuration

### Basic Fallback Setup

```javascript
{
  enableFallback: true,
  retryAttempts: 2,
  fallbackModels: [
    'gpt-3.5-turbo',    // Reliable fallback
    'claude-3-haiku'    // Secondary fallback
  ]
}
```

### Advanced Fallback Strategies

#### Tiered Fallback
```javascript
{
  enableFallback: true,
  retryAttempts: 3,
  fallbackModels: [
    'gpt-4',            // Try premium first
    'gpt-3.5-turbo',    // Then cost-effective
    'llama-2-70b'       // Finally open source
  ]
}
```

#### Provider Diversification
```javascript
{
  enableFallback: true,
  retryAttempts: 2,
  fallbackModels: [
    'claude-3-sonnet',  // Different provider
    'gemini-pro',       // Another provider
    'gpt-3.5-turbo'     // Reliable backup
  ]
}
```

### Fallback Triggers

- **Rate Limits**: Model temporarily unavailable
- **Timeouts**: Model taking too long to respond
- **Errors**: Model returning error responses
- **Overload**: Model capacity exceeded

## 🔧 Advanced Settings

### Request Requirements

#### Maximum Latency
```javascript
{
  maxLatencyMs: 5000,  // Reject models slower than 5s
  // Router will only consider fast models
}
```

#### Maximum Cost
```javascript
{
  maxCostPerToken: 0.02, // Reject expensive models
  // Router will only use cost-effective options
}
```

#### Capability Requirements
```javascript
{
  functionCalling: true,    // Require function calling support
  structuredOutput: true,   // Require JSON mode
  fileUpload: false,        // Don't need file upload
  streaming: true           // Require streaming support
}
```

### Performance Tuning

#### Timeout Configuration
```javascript
{
  timeout: 30,          // 30 second timeout
  // Requests exceeding this will trigger fallback
}
```

#### Rate Limiting
```javascript
{
  rateLimit: 100,       // 100 requests per minute
  // Helps manage costs and prevent abuse
}
```

#### Caching
```javascript
{
  enableCaching: true,  // Cache similar requests
  // Improves performance and reduces costs
}
```

## 📊 Monitoring and Analytics

### Key Metrics to Track

#### Success Metrics
- **Success Rate**: Should be >99%
- **Average Latency**: Track by model and request type
- **Cost Per Request**: Monitor spending patterns
- **Model Distribution**: See which models are selected

#### Performance Indicators
```javascript
// Example analytics data
{
  successRate: 0.995,           // 99.5% success
  avgLatencyMs: 1250,           // 1.25s average
  avgCostUsd: 0.0015,          // $0.0015 per request
  modelDistribution: {
    'gpt-3.5-turbo': 0.6,      // 60% of requests
    'gpt-4': 0.25,             // 25% of requests
    'claude-3-sonnet': 0.15    // 15% of requests
  }
}
```

### Optimization Based on Analytics

#### High Cost Issues
```javascript
// If avgCostUsd > target
{
  costWeight: 0.6,      // Increase cost priority
  qualityWeight: 0.25,  // Reduce quality slightly
  // Add more cost-effective models
  availableModels: [...existing, 'llama-2-70b', 'mistral-7b']
}
```

#### High Latency Issues
```javascript
// If avgLatencyMs > target
{
  latencyWeight: 0.5,   // Prioritize speed
  costWeight: 0.3,      // Accept higher costs
  // Remove slow models
  availableModels: models.filter(m => !slowModels.includes(m))
}
```

#### Low Quality Issues
```javascript
// If quality scores < target
{
  qualityWeight: 0.5,   // Prioritize quality
  costWeight: 0.2,      // Accept higher costs
  // Add premium models
  availableModels: [...existing, 'gpt-4', 'claude-3-opus']
}
```

## 🔒 Security and Compliance

### Data Governance

#### Regional Compliance
```javascript
{
  availableModels: [
    'mistral-large',    // EU-based for GDPR
    'claude-3-sonnet',  // US-based
    // Exclude models not meeting compliance requirements
  ]
}
```

#### Data Retention
```javascript
{
  detailedAnalytics: false,  // Disable detailed logging
  enableCaching: false,      // Disable request caching
  // Minimize data retention for sensitive workloads
}
```

### Access Control

#### API Key Management
- Rotate keys regularly
- Use separate keys for different environments
- Monitor key usage patterns
- Implement rate limiting per key

#### Router Isolation
- Separate routers for different teams/projects
- Environment-specific configurations
- Granular access controls

## 🧪 Testing and Validation

### A/B Testing Router Configurations

```javascript
// Configuration A: Cost-optimized
const routerA = {
  costWeight: 0.6,
  qualityWeight: 0.3,
  latencyWeight: 0.1
};

// Configuration B: Quality-optimized  
const routerB = {
  qualityWeight: 0.6,
  costWeight: 0.2,
  latencyWeight: 0.2
};

// Split traffic and compare metrics
```

### Gradual Rollout Strategy

1. **Development**: Test with small traffic
2. **Staging**: Validate with realistic load
3. **Canary**: Deploy to 5% of production traffic
4. **Full Rollout**: Gradually increase to 100%

### Configuration Validation

```javascript
// Validate configuration before deployment
function validateRouterConfig(config) {
  // Check weights sum to 1.0
  const totalWeight = config.costWeight + config.qualityWeight + 
                     config.latencyWeight + config.carbonWeight;
  assert(Math.abs(totalWeight - 1.0) < 0.001);
  
  // Ensure fallback models are available
  assert(config.fallbackModels.every(model => 
    config.availableModels.includes(model)
  ));
  
  // Validate model capabilities
  if (config.functionCalling) {
    assert(config.availableModels.some(model => 
      supportsFunctionCalling(model)
    ));
  }
}
```

## 📋 Configuration Templates

### Startup Template
```javascript
{
  name: "Startup Router",
  mode: "smartRouter",
  costWeight: 0.5,
  qualityWeight: 0.3,
  latencyWeight: 0.15,
  carbonWeight: 0.05,
  availableModels: [
    'gpt-3.5-turbo',
    'claude-3-haiku', 
    'llama-2-70b'
  ],
  enableFallback: true,
  fallbackModels: ['gpt-3.5-turbo'],
  retryAttempts: 2
}
```

### Enterprise Template
```javascript
{
  name: "Enterprise Router",
  mode: "smartRouter",
  costWeight: 0.25,
  qualityWeight: 0.4,
  latencyWeight: 0.25,
  carbonWeight: 0.1,
  availableModels: [
    'gpt-4',
    'claude-3-opus',
    'claude-3-sonnet',
    'gemini-pro',
    'gpt-3.5-turbo'
  ],
  enableFallback: true,
  fallbackModels: ['claude-3-sonnet', 'gpt-3.5-turbo'],
  retryAttempts: 3,
  functionCalling: true,
  structuredOutput: true
}
```

### Real-time Template
```javascript
{
  name: "Real-time Router",
  mode: "smartRouter", 
  latencyWeight: 0.6,
  qualityWeight: 0.25,
  costWeight: 0.1,
  carbonWeight: 0.05,
  availableModels: [
    'gpt-3.5-turbo',
    'claude-3-haiku',
    'gemini-flash'
  ],
  maxLatencyMs: 3000,
  enableFallback: true,
  fallbackModels: ['gpt-3.5-turbo'],
  retryAttempts: 1
}
```

## 🚀 Best Practices

### Configuration Management
- Version control your router configurations
- Document configuration changes
- Test configurations in staging first
- Monitor metrics after changes

### Model Selection
- Start with 3-5 models for simplicity
- Include models from different providers
- Balance cost, quality, and speed
- Regular review and optimization

### Fallback Strategy
- Always enable fallback for production
- Use reliable models as fallbacks
- Test fallback scenarios regularly
- Monitor fallback trigger rates

### Performance Optimization
- Adjust weights based on actual usage
- Remove underperforming models
- Add new models as they become available
- Regular performance reviews

## 🆘 Troubleshooting

### Common Configuration Issues

**Issue**: Router always selects expensive models
```javascript
// Solution: Increase cost weight
{
  costWeight: 0.6,  // Increase from current value
  qualityWeight: 0.3,
  latencyWeight: 0.1
}
```

**Issue**: Responses are too slow
```javascript
// Solution: Prioritize latency, set max latency
{
  latencyWeight: 0.5,
  maxLatencyMs: 5000,  // Reject slow models
  // Remove slow models from available list
}
```

**Issue**: Frequent fallback triggers
```javascript
// Solution: Add more reliable models, increase retry attempts
{
  availableModels: [...existing, 'gpt-3.5-turbo'], // Add reliable model
  retryAttempts: 3,  // Increase retries
  fallbackModels: ['gpt-3.5-turbo', 'claude-3-haiku'] // Multiple fallbacks
}
```

## 🔗 Related Documentation

- **[Getting Started](getting-started.md)** - Basic router setup
- **[NPM Package](npm-package.md)** - Using routers in code
- **[Backend Architecture](backend-architecture.md)** - How routing works
- **[API Reference](api-reference.md)** - Complete API docs

---

**Need help?** Join our [Discord community](https://discord.gg/modelpilot) or email support@modelpilot.ai
