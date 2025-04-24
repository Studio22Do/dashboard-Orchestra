# Bot de Twitter con RapidAPI y Tweepy

Este proyecto proporciona diferentes alternativas para interactuar con Twitter (X):
1. Usando APIs de RapidAPI, permitiendo publicar tweets y obtener información sin depender exclusivamente de la API oficial de Twitter.
2. Usando la biblioteca Tweepy para interactuar directamente con la API oficial de Twitter.

## Requisitos

- Python 3.8+
- Una cuenta de RapidAPI con una clave API (para el método RapidAPI)
- Cookies de autenticación de Twitter (`auth_token` y `ct0`) (para el método RapidAPI)
- Credenciales de desarrollador de Twitter (para el método Tweepy)

## Instalación

1. Clonar este repositorio:

```bash
git clone https://github.com/tu-usuario/twitter-rapidapi-bot.git
cd twitter-rapidapi-bot
```

2. Crear un entorno virtual:

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Configurar las variables de entorno en un archivo `.env`:

Para RapidAPI:
```
RAPIDAPI_KEY=tu_clave_api_de_rapidapi
TWITTER_AUTH_TOKEN=tu_cookie_auth_token
TWITTER_CT0=tu_cookie_ct0
```

Para Tweepy:
```
TWITTER_API_KEY=tu_api_key
TWITTER_API_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_TOKEN_SECRET=tu_access_token_secret
```

## Opciones de Uso

### 1. Usar la API oficial de Twitter con Tweepy

Esta opción utiliza la biblioteca Tweepy para interactuar directamente con la API oficial de Twitter.

```python
from twitter_api import TwitterAPI

# Inicializar la API de Twitter
twitter = TwitterAPI()

# Publicar un tweet
tweet = twitter.post_tweet("¡Mi primer tweet con Tweepy! 🚀")
print(f"Tweet publicado con ID: {tweet['id']}")

# Publicar un tweet con imagen
tweet_con_imagen = twitter.post_tweet(
    "¡Mi tweet con imagen! 📸", 
    media_paths=["ruta/a/tu/imagen.jpg"]
)

# Obtener timeline de un usuario
tweets = twitter.get_user_timeline("elonmusk", count=5)
for tweet in tweets:
    print(f"ID: {tweet['id']}")
    print(f"Texto: {tweet['text']}")
    print(f"Fecha: {tweet['created_at']}")
    print("---")

# Retuitear un tweet
retweet = twitter.retweet("1234567890")

# Eliminar un tweet
twitter.delete_tweet("1234567890")
```

También puedes usar el script de prueba incluido:

```bash
python test_tweepy.py
```

### 2. Usar API no oficial de Twitter (TwitterBot)

Esta opción utiliza la API de Twitter disponible en RapidAPI para crear tweets.

```python
from rapid import TwitterBot
import os
from dotenv import load_dotenv

load_dotenv()

bot = TwitterBot(os.getenv("RAPIDAPI_KEY"))
bot.base_url = "https://twitter154.p.rapidapi.com"

response = bot.create_tweet(
    text="Mi primer tweet con la API! 🚀",
    auth_token=os.getenv("TWITTER_AUTH_TOKEN"),
    ct0=os.getenv("TWITTER_CT0")
)

print(response)
```

### 3. Usar TwttrAPI (TwttrBot)

TwttrAPI es una alternativa que ofrece tanto funcionalidades de lectura como de escritura.

```python
from rapid import TwttrBot
import os
from dotenv import load_dotenv

load_dotenv()

bot = TwttrBot(os.getenv("RAPIDAPI_KEY"))

# Obtener tweets de un usuario
tweets = bot.get_user_tweets("elonmusk", limit=5)
print(tweets)

# Publicar un tweet
response = bot.create_tweet(
    text="¡Tweet de prueba con TwttrAPI! 🚀",
    auth_token=os.getenv("TWITTER_AUTH_TOKEN"),
    ct0=os.getenv("TWITTER_CT0")
)

print(response)
```

### 4. Bot Híbrido (HybridTwitterBot)

Este bot combina APIs GET de RapidAPI para obtener contenido (noticias, frases, etc.) y luego publica tweets automáticamente.

```python
from hybrid_bot import HybridTwitterBot
import os
from dotenv import load_dotenv

load_dotenv()

bot = HybridTwitterBot(os.getenv("RAPIDAPI_KEY"))
bot.twitter_bot.base_url = "https://twitter154.p.rapidapi.com"

# Generar ejemplos de tweets (sin publicar)
tweet_noticias = bot.generar_tweet_noticias()
print("Tweet de noticias:", tweet_noticias)

tweet_motivador = bot.generar_tweet_motivador()
print("Tweet motivador:", tweet_motivador)

# Publicar un tweet automático
resultado = bot.publicar_tweet_automatico(
    tipo="noticias",  # o "motivador"
    auth_token=os.getenv("TWITTER_AUTH_TOKEN"),
    ct0=os.getenv("TWITTER_CT0")
)

print(resultado)
```

## Cómo obtener las cookies de autenticación

1. Inicia sesión en Twitter (X) desde tu navegador
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Aplicación" o "Almacenamiento"
4. Busca las cookies "auth_token" y "ct0" en el dominio twitter.com
5. Copia sus valores y guárdalos en tu archivo .env

**Importante:** Estas cookies equivalen a tener acceso completo a tu cuenta. No compartas estos valores y úsalos con responsabilidad.

## Cómo obtener las credenciales para Tweepy

1. Crea una cuenta de desarrollador en [Twitter Developer Portal](https://developer.twitter.com/)
2. Crea un proyecto y una aplicación
3. Configura la aplicación para obtener las claves API y tokens de acceso
4. Guarda las credenciales en tu archivo .env:
   - TWITTER_API_KEY
   - TWITTER_API_SECRET
   - TWITTER_ACCESS_TOKEN
   - TWITTER_ACCESS_TOKEN_SECRET

**Importante:** Estas credenciales equivalen a tener acceso a tu cuenta. No compartas estos valores y úsalos con responsabilidad.

## Limitaciones

- Las cookies de autenticación expiran aproximadamente cada 30 días
- El uso excesivo o automatizado puede llevar a restricciones en tu cuenta de Twitter
- Las APIs de RapidAPI pueden tener límites de uso según tu plan

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles. 