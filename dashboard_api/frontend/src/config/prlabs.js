export const PR_LABS_CONFIG = {
  CATEGORIES: {
    CHAT: 'Chat Models',
    IMAGE: 'Image Generation',
    TEXT: 'Text Processing',
    VOICE: 'Voice Features',
    CUSTOM_BOT: 'Custom Chatbots',
    AI_TOOLS: 'AI Tools'
  },
  
  FEATURES: [
    {
      id: 'chat-models',
      title: 'Modelos de Chat IA',
      description: 'GPT-4, DeepSeek, Mixtral, y más',
      category: 'Chat Models',
      route: '/prlabs/chat',
      apiName: 'PR Labs Chat API',
      models: ['gpt-4o-mini', 'deepseek', 'mixtral', 'gpt-3.5']
    },
    {
      id: 'image-generation',
      title: 'Generación de Imágenes',
      description: 'Crea imágenes asombrosas con IA',
      category: 'Image Generation',
      route: '/prlabs/image',
      apiName: 'PR Labs Image API'
    },
    {
      id: 'text-processing',
      title: 'Procesamiento de Texto',
      description: 'Humanización y análisis de texto',
      category: 'Text Processing',
      route: '/prlabs/text',
      apiName: 'PR Labs Text API'
    },
    {
      id: 'custom-chatbots',
      title: 'Chatbots Personalizados',
      description: 'Crea tu propio asistente IA',
      category: 'Custom Chatbots',
      route: '/prlabs/chatbot',
      apiName: 'PR Labs Chatbot API'
    },
    {
      id: 'voice-features',
      title: 'Características de Voz',
      description: 'Text-to-Speech y análisis de voz',
      category: 'Voice Features',
      route: '/prlabs/voice',
      apiName: 'PR Labs Voice API'
    },
    {
      id: 'ai-tools',
      title: 'Herramientas IA',
      description: 'Suite completa de herramientas IA',
      category: 'AI Tools',
      route: '/prlabs/tools',
      apiName: 'PR Labs Tools API'
    }
  ],

  API_CONFIG: {
    BASE_URL: 'https://chatgpt-42.p.rapidapi.com',
    HEADERS: {
      'x-rapidapi-key': '9dc7412cabmsh04d2de9d55522bap1643f6jsn6e3113942f4a',
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  }
}; 