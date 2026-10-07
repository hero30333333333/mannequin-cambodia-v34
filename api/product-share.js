const SUPABASE_URL = 'https://nldpxyahkmzamtswtkq.supabase.co';
const SUPABASE_ANON_KEY =
  'sb_publishable_YJUvwXYDX07wwh_moKgdwQ_OtVXUbnC';

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Missing product id', {
        status: 400,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const apiUrl =
      `${SUPABASE_URL}/rest/v1/products` +
      `?select=*` +
      `&id=eq.${encodeURIComponent(id)}` +
      `&active=eq.true` +
      `&limit=1`;

    const response = await fetch(apiUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      return new Response('Unable to load product', {
        status: 502,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const products = await response.json();
    const product = products[0];

    if (!product) {
      return new Response('Product not found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const esc = (value) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const title =
      product.name_km ||
      product.name_en ||
      product.name ||
      'ម៉ានីកាំង - កម្ពុជា';

    const description =
      product.description_km ||
      product.description_en ||
      product.description ||
      'ផលិតផលគុណភាពពី ម៉ានីកាំង - កម្ពុជា';

    const image =
      product.image_url ||
      'https://mannequin-cambodia-v34-content-prod.vercel.app/assets/mannequin-display.jpeg';

    const productUrl =
      `https://mannequin-cambodia-v34-content-prod.vercel.app/?product=${encodeURIComponent(id)}#products`;

    const html = `<!doctype html>
<html lang="km">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>

<meta name="description" content="${esc(description)}">

<meta property="og:type" content="product">
<meta property="og:site_name" content="ម៉ានីកាំង - កម្ពុជា">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(productUrl)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:alt" content="${esc(title)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">

<meta http-equiv="refresh" content="0;url=${esc(productUrl)}">
</head>
<body>
<p>កំពុងបើកផលិតផល...</p>
<a href="${esc(productUrl)}">បើកផលិតផល</a>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return new Response('Server error', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}
