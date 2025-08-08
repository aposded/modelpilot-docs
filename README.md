# ModelPilot Documentation

Welcome to the ModelPilot documentation site! This repository contains comprehensive documentation for the ModelPilot AI routing platform.

## 🚀 Quick Links

- **[Getting Started](getting-started.md)** - Set up your first router
- **[NPM Package](npm-package.md)** - Use ModelPilot in your applications
- **[Router Configuration](router-configuration.md)** - Configure intelligent routing
- **[Backend Architecture](backend-architecture.md)** - Understand how ModelPilot works
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Examples](examples/)** - Code examples and tutorials

## 📖 What is ModelPilot?

ModelPilot is an intelligent AI routing platform that automatically selects the best AI model for each request based on your optimization preferences. It provides:

- **Intelligent Routing**: Automatic model selection based on cost, latency, quality, and carbon footprint
- **OpenAI Compatibility**: Drop-in replacement for OpenAI with enhanced capabilities
- **Cost Optimization**: Up to 70% cost savings through smart model selection
- **Fallback Handling**: Automatic retries and failover for maximum reliability
- **Advanced Analytics**: Detailed performance metrics and insights

## 🎯 Key Features

### For Developers
- OpenAI-compatible npm package for easy migration
- Streaming responses and function calling support
- TypeScript support with full type definitions
- Comprehensive error handling and retry logic

### For Operations
- Real-time analytics and monitoring
- Cost tracking and optimization
- Performance metrics and insights
- Automated fallback and retry strategies

### For Organizations
- Multi-model support (OpenAI, Anthropic, Google, 100+ others)
- Compliance and data governance controls
- Team management and API key controls
- Enterprise-grade security and reliability

## 🏗️ Architecture Overview

ModelPilot consists of three main components:

1. **Dashboard**: Web interface for router configuration and analytics
2. **Router Engine**: Intelligent model selection and request routing
3. **NPM Package**: OpenAI-compatible client library

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

## 🚦 Getting Started

1. **Sign up** at [modelpilot.ai](https://modelpilot.ai)
2. **Create a router** in the dashboard
3. **Get your API key** from settings
4. **Install the package**: `npm install modelpilot`
5. **Start building** with our OpenAI-compatible API

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

## 📚 Documentation Structure

- **`getting-started.md`** - Quick start guide and basic concepts
- **`npm-package.md`** - Complete npm package documentation
- **`router-configuration.md`** - Router setup and optimization
- **`backend-architecture.md`** - Technical architecture details
- **`api-reference.md`** - Complete API reference
- **`examples/`** - Code examples and tutorials
- **`guides/`** - In-depth guides and best practices

## 🤝 Contributing

This documentation is open source! Contributions are welcome:

1. Fork this repository
2. Make your changes
3. Submit a pull request

## 📄 License

This documentation is licensed under MIT License.

## 🆘 Support

- **Documentation**: [docs.modelpilot.ai](https://docs.modelpilot.ai)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/your-org/modelpilot/issues)
- **Discord**: [Join our community](https://discord.gg/modelpilot)
- **Email**: support@modelpilot.ai
