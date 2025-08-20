"""
Configuración de costos de créditos para cada API
"""

# Costos de créditos por API (puntos a descontar al cliente)
CREDITS_COST = {
    # Instagram APIs
    'instagram_profile': 1,
    'instagram_followers': 1,
    'instagram_following': 1,
    'instagram_posts': 1,
    'instagram_stories': 1,
    'instagram_highlights': 1,
    'instagram_full_profile': 2,

    'instagram_stats': 1,
    
    # AI Humanizer
    'ai_humanizer': 2,
    'ai_humanizer_basic': 1,
    
    # SEO APIs
    'seo_analyzer': 2,
    'seo_mastermind': 2,
    'similarweb': 1,
    'google_keyword_insight': 3,
    'domain_metrics': 1,
    'ahrefs_dr': 2,
    'pagespeed_insights': 1,
    'website_analyzer': 2,  # Análisis completo de velocidad, SEO y dominio
    'seo_keyword_research': 3,
    
    # Content APIs
    'product_description': 1,
    'social_media_content': 2,
    'runwayml': 3,
    'speech_to_text': 1,
    'whisper_url': 2,
    
    # File/Media APIs
    'pdf_converter': 1,
    'snap_video': 1,
    'advanced_image_manipulation': 1,
    'picpulse': 2,
    
    # Other APIs
    'google_news': 1,
    'google_paid_search': 1,
    'whois_lookup': 1,
    'website_status': 1,
    'ssl_checker': 1,
    'text_extract': 1,
    'prlabs_chat': 1,
    'prlabs_image': 2,
    'prlabs_text': 1,
    'prlabs_voice': 2,
    'qrcode_generator': 1,
    'word_count': 2,
    'perplexity': 1,
    'mediafy_api': 1,
}

# ===== Helpers dinámicos PRLABS =====
PRLABS_PREMIUM_MODELS = {'gpt-4', 'gpt-4o', 'deepseek-r1', 'o3-mini'}


def compute_prlabs_chat_cost(model: str | None, has_image: bool = False) -> int:
    """Calcula el costo de chat según modelo y si incluye imagen.
    - Económicos: 1 punto (por defecto)
    - Premium: 2 puntos
    - Con visión: +1 punto adicional
    """
    model_lc = (model or '').lower()
    base = 2 if model_lc in PRLABS_PREMIUM_MODELS else 1
    return base + (1 if has_image else 0)


def has_image_from_payload(payload: dict | None) -> bool:
    if not payload:
        return False
    # Convención: si hay img_url o attachments
    return bool(payload.get('img_url') or payload.get('image_url') or payload.get('images'))


def get_credits_cost(api_name):
    """
    Obtener el costo de créditos para una API específica
    
    Args:
        api_name (str): Nombre de la API
        
    Returns:
        int: Costo en créditos (1 por defecto si no está definido)
    """
    return CREDITS_COST.get(api_name, 1)


def get_api_cost_by_endpoint(endpoint_path):
    """
    Obtener el costo de créditos basado en el path del endpoint
    
    Args:
        endpoint_path (str): Path del endpoint (ej: '/instagram/profile/username')
        
    Returns:
        int: Costo en créditos
    """
    # Mapear paths a nombres de API
    path_mapping = {
        # Instagram
        '/instagram/profile/username': 'instagram_profile',
        '/instagram/followers': 'instagram_followers',
        '/instagram/following': 'instagram_following',
        '/instagram/posts': 'instagram_posts',
        '/instagram/stories': 'instagram_stories',
        '/instagram/highlights': 'instagram_highlights',
        '/instagram/full-profile': 'instagram_full_profile',
    
        '/instagram-stats/check': 'instagram_stats',
        
        # AI Humanizer
        '/ai-humanizer/': 'ai_humanizer',
        '/ai-humanizer/basic': 'ai_humanizer_basic',
        
        # SEO
        '/seo-analyzer/analyze': 'seo_analyzer',
        '/seo-mastermind/generate': 'seo_mastermind',
        '/similarweb/insights': 'similarweb',
        '/keyword-insight/search': 'google_keyword_insight',
        '/domain-metrics/check': 'domain_metrics',
        '/ahrefs-dr/check': 'ahrefs_dr',
        '/pagespeed-insights/analyze': 'pagespeed_insights',
        '/seo-keyword-research/generate': 'seo_keyword_research',
        
        # Content
        '/product-description/generate': 'product_description',
        '/social-media-content/generate': 'social_media_content',
        '/runwayml/generate': 'runwayml',
        '/speech-to-text/transcribe': 'speech_to_text',
        '/whisper-url/transcribe': 'whisper_url',
        
        # File/Media
        '/pdf-converter/convert': 'pdf_converter',
        '/media-downloader/download': 'snap_video',
        '/image-manipulation/transform': 'advanced_image_manipulation',
        '/picpulse/analyze': 'picpulse',
        
        # Other
        '/google-news/search': 'google_news',
        '/paid-search/analyze': 'google_paid_search',
        '/whois-lookup/lookup': 'whois_lookup',
        '/website-status/check': 'website_status',
        '/ssl-checker/check': 'ssl_checker',
        '/text-extract/extract': 'text_extract',
        '/prlabs/chat': 'prlabs_chat',
        '/prlabs/image': 'prlabs_image',
        '/prlabs/text': 'prlabs_text',
        '/prlabs/voice': 'prlabs_voice',
        '/qrcode-generator/generate': 'qrcode_generator',
        '/word-count/calculate': 'word_count',
        '/perplexity/calculate': 'perplexity',
        '/mediafy-api/analyze': 'mediafy_api',
    }
    
    api_name = path_mapping.get(endpoint_path)
    return get_credits_cost(api_name) if api_name else 1
