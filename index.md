---
layout: home
title: ModelPilot Documentation
---

# ModelPilot Documentation

Welcome to ModelPilot, the intelligent AI routing platform that automatically selects the best AI model for each request based on your optimization preferences.

## 🚀 Quick Start

Get started with ModelPilot in minutes:

1. **[Sign up](https://modelpilot.ai)** for a free account
2. **[Create your first router](getting-started.html)** 
3. **[Install the npm package](npm-package.html)**: `npm install modelpilot`
4. **Start building** with our OpenAI-compatible API

```javascript
import ModelPilot from 'modelpilot';

const client = new ModelPilot({
  apiKey: 'your-api-key',
  routerId: 'your-router-id'
});

const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

## 🎯 Key Features

<div class="feature-grid">
  <div class="feature">
    <h3>🧠 Intelligent Routing</h3>
    <p>Automatic model selection based on cost, latency, quality, and carbon footprint</p>
  </div>
  
  <div class="feature">
    <h3>🔄 OpenAI Compatible</h3>
    <p>Drop-in replacement for OpenAI with enhanced capabilities</p>
  </div>
  
  <div class="feature">
    <h3>💰 Cost Optimization</h3>
    <p>Up to 70% cost savings through smart model selection</p>
  </div>
  
  <div class="feature">
    <h3>🛡️ Reliability</h3>
    <p>Automatic fallback and retry logic for maximum uptime</p>
  </div>
  
  <div class="feature">
    <h3>📊 Analytics</h3>
    <p>Detailed performance metrics and insights</p>
  </div>
  
  <div class="feature">
    <h3>🌐 100+ Models</h3>
    <p>Access to OpenAI, Anthropic, Google, and many more</p>
  </div>
</div>

## 📚 Documentation

<div class="docs-grid">
  <a href="getting-started.html" class="doc-card">
    <h3>🚀 Getting Started</h3>
    <p>Set up your first router and start using ModelPilot</p>
  </a>
  
  <a href="npm-package.html" class="doc-card">
    <h3>📦 NPM Package</h3>
    <p>Complete guide to using ModelPilot in your applications</p>
  </a>
  
  <a href="router-configuration.html" class="doc-card">
    <h3>⚙️ Router Configuration</h3>
    <p>Advanced configuration and optimization strategies</p>
  </a>
  
  <a href="backend-architecture.html" class="doc-card">
    <h3>🏗️ Backend Architecture</h3>
    <p>Understanding how ModelPilot works under the hood</p>
  </a>
  
  <a href="api-reference.html" class="doc-card">
    <h3>📖 API Reference</h3>
    <p>Complete API documentation and reference</p>
  </a>
  
  <a href="examples/" class="doc-card">
    <h3>💡 Examples</h3>
    <p>Code examples and practical implementations</p>
  </a>
</div>

## 🎯 Use Cases

### For Developers
- **Rapid Prototyping**: Start with one model, scale to many
- **Cost Optimization**: Automatically use the most cost-effective model
- **Performance Tuning**: Optimize for speed, quality, or cost
- **Future-Proofing**: Access new models without code changes

### For Startups
- **Minimize Costs**: Up to 70% savings on AI API costs
- **Maximize Reliability**: Built-in fallback and retry logic
- **Scale Efficiently**: Handle growth without infrastructure changes
- **Focus on Product**: Less time managing AI providers

### For Enterprises
- **Multi-Model Strategy**: Reduce vendor lock-in
- **Compliance Controls**: Data governance and regional requirements
- **Team Management**: Centralized API key and usage management
- **Advanced Analytics**: Detailed usage and cost insights

## 🏗️ Architecture

ModelPilot consists of three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │  ModelPilot     │    │   AI Models     │
│                 │    │   Router        │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ NPM Pkg   │──┼────┼──│ Smart     │──┼────┼──│ OpenAI    │  │
│  │           │  │    │  │ Router    │  │    │  │ Anthropic │  │
│  └───────────┘  │    │  └───────────┘  │    │  │ Google    │  │
└─────────────────┘    └─────────────────┘    │  │ +100 more│  │
                                              │  └───────────┘  │
                                              └─────────────────┘
```

## 🆘 Support

Need help? We're here for you:

- **📖 Documentation**: You're reading it!
- **💬 Discord**: [Join our community](https://discord.gg/modelpilot)
- **📧 Email**: [support@modelpilot.ai](mailto:support@modelpilot.ai)
- **🐛 GitHub**: [Report issues](https://github.com/your-org/modelpilot/issues)

## 🚀 Ready to Get Started?

[Create your free account](https://modelpilot.ai) and start optimizing your AI costs today!

<style>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature {
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.feature h3 {
  margin-top: 0;
  color: #2c3e50;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.doc-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.doc-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
  transform: translateY(-2px);
}

.doc-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.doc-card p {
  margin-bottom: 0;
  color: #6c757d;
}
</style>
