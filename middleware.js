export const config = {
  matcher: '/',
};

const BOT_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Pinterest|Slackbot|WhatsApp|TelegramBot|Discordbot/i;

export default async function middleware(request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('product');
  const userAgent = request.headers.get('user-agent') || '';

  // Only change the response for social-media crawlers
  // when the URL contains ?product=...
  if (!productId || !BOT_UA.test(userAgent)) {
    return fetch(request);
  }

  const apiUrl = new URL('/api/product-share', request.url);
  apiUrl.searchParams.set('id', productId);

  return fetch(apiUrl, {
    headers: {
      'user-agent': userAgent,
      accept: 'text/html',
    },
  });
}
