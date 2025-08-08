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
      apiName: 'sinfonIA Chat API',
      models: ['gpt-4o-mini', 'deepseek', 'mixtral', 'gpt-3.5']
    },
    {
      id: 'image-generation',
      title: 'Generación de Imágenes',
      description: 'Crea imágenes asombrosas con IA',
      category: 'Image Generation',
      route: '/prlabs/image',
      apiName: 'sinfonIA Image API'
    },
    {
      id: 'custom-chatbots',
      title: 'Chatbots Personalizados',
      description: 'Crea tu propio asistente IA',
      category: 'Custom Chatbots',
      route: '/prlabs/chatbot',
      apiName: 'sinfonIA Chatbot API'
    },
    {
      id: 'voice-features',
      title: 'Características de Voz',
      description: 'Text-to-Speech y análisis de voz',
      category: 'Voice Features',
      route: '/prlabs/voice',
      apiName: 'sinfonIA Voice API'
    },
  ],

  COSTS: {
    CHAT: {
      BASE: 1,
      PREMIUM: 2,
      VISION_EXTRA: 1,
      PREMIUM_MODELS: ['gpt-4', 'gpt-4o', 'deepseek-r1', 'o3-mini']
    },
    IMAGE: 3,
    VOICE: 2,
    TEXT: 1
  },

  API_CONFIG: {
    BASE_URL: 'https://chatgpt-42.p.rapidapi.com',
    HEADERS: {
      'x-rapidapi-key': '9dc7412cabmsh04d2de9d55522bap1643f6jsn6e3113942f4a',
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  }
};

export const getChatCost = (model = 'gpt-4o-mini', hasImage = false) => {
  const { CHAT } = PR_LABS_CONFIG.COSTS;
  const isPremium = CHAT.PREMIUM_MODELS.includes(model.toLowerCase());
  const base = isPremium ? CHAT.PREMIUM : CHAT.BASE;
  return base + (hasImage ? CHAT.VISION_EXTRA : 0);
}; 