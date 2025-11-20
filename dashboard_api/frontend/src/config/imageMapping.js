// Mapeo de imágenes de banner para cada aplicación
import picpulseBanner from '../assets/images/apps/banners/PICPULSE.png';
import chatgptBanner from '../assets/images/apps/banners/ChatGPT4.png';
import mediafyBanner from '../assets/images/apps/banners/Mediafy.png';
import googleNewsBanner from '../assets/images/apps/banners/GoogleNews.png';
import webauditBanner from '../assets/images/apps/banners/Webaudit.png';
import seoanalyzerBanner from '../assets/images/apps/banners/seoanalyzer.png';
import similarwebBanner from '../assets/images/apps/banners/similarweb.png';
import pdftotextBanner from '../assets/images/apps/banners/pdftotext.png';
import snapvideoBanner from '../assets/images/apps/banners/snapvideo.png';

import webstatusBanner from '../assets/images/apps/banners/webstatus.png';
import wordcountBanner from '../assets/images/apps/banners/wordcount.png';
import sslcheckerBanner from '../assets/images/apps/banners/SSLchecker.png';
import whoisBanner from '../assets/images/apps/banners/Whois.png';
import runwayBanner from '../assets/images/apps/banners/runway.png';
import productdescriptionBanner from '../assets/images/apps/banners/productdescription.png';
import perplexityBanner from '../assets/images/apps/banners/perplexity.png';
import imagetransformBanner from '../assets/images/apps/banners/imagetransform.png';
import domaincheckerBanner from '../assets/images/apps/banners/domainchecker.png';
import contentcreatorBanner from '../assets/images/apps/banners/contentcreator.png';
import keywordinsightsBanner from '../assets/images/apps/banners/keywordinsights.png';
import keywordsearchBanner from '../assets/images/apps/banners/keywordsearch.png';
import marketinghubBanner from '../assets/images/apps/banners/marketinghub.png';
import qrgeneratorBanner from '../assets/images/apps/banners/QRGenerator.png';
import speechtotextBanner from '../assets/images/apps/banners/SPEECHTOTEXT.png';
import sinfoniaBanner from '../assets/images/apps/banners/SINFONIA.png';  // ← AGREGADO: Banner de SinfonIA

// Mapeo de apps a sus imágenes de banner
export const getAppBanner = (appId) => {
  const bannerMap = {
    // Social Media & Listening

    'instagram-stats': mediafyBanner,
    'mediafy': mediafyBanner,

    // AI Tools
    'picpulse': picpulseBanner,
    'perplexity': perplexityBanner,
    'genie-ai': chatgptBanner,
    'ai-humanizer': chatgptBanner,
    'ai-social-media': contentcreatorBanner,
    'prlabs': sinfoniaBanner,  // ← CORREGIDO: Ahora usa su propio banner

    // Web & SEO
    'google-news': googleNewsBanner,
    'google-keyword': keywordinsightsBanner,  // ← AGREGADO: Google Keyword Insights
    'seo-analyzer': seoanalyzerBanner,
    'seo-mastermind': keywordsearchBanner,
    'similar-web': similarwebBanner,
    'webaudit': webauditBanner,
    'domain-metrics': domaincheckerBanner,
    'page-speed': webauditBanner,
    'ssl-checker': sslcheckerBanner,
    'whois-lookup': whoisBanner,
    'website-status': webstatusBanner,
    'website-analyzer': webauditBanner,
    'ahrefs-dr': keywordinsightsBanner,

    // Creative & Content
    'pdf-to-text': pdftotextBanner,
    'snap-video': snapvideoBanner,

    'runwayml': runwayBanner,  // ← AGREGADO: ID sin guión
    'runway-ml': runwayBanner, // ← YA EXISTÍA: ID con guión
    'advanced-image': imagetransformBanner,
    'image-manipulation': imagetransformBanner,
    'qr-generator': qrgeneratorBanner,

    // Utilities
    'word-count': wordcountBanner,
    'speech-to-text': speechtotextBanner,
    'ecommerce-description': productdescriptionBanner,
    'product-description': productdescriptionBanner,

    // Default para apps no mapeadas
    'default': chatgptBanner
  };

  return bannerMap[appId] || bannerMap['default'];
};

export default getAppBanner;
