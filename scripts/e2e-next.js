const base = process.env.BASE_URL || 'http://localhost:3002';
// Use Node's global fetch (Node 18+). If not available, instruct to install node-fetch.
const fetch = global.fetch || (function(){
  throw new Error('Global fetch is not available in this Node runtime. Please run with Node 18+ or install node-fetch and require it.');
})();

async function pretty(res) {
  const headers = {};
  res.headers.forEach((v,k)=> headers[k]=v);
  const body = await res.text();
  let json = null;
  try { json = JSON.parse(body); } catch(e) {}
  return { status: res.status, headers, body: json ?? body };
}

async function run() {
  console.log('E2E runner against', base);
  const email = `e2e_${Date.now()}@example.com`;
  const pw = 'password123';

  console.log('\n1) Register');
  let r = await fetch(base + '/api/auth/register', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name: 'E2E', email, password: pw }),
  });
  console.log(await pretty(r));

  console.log('\n2) Login');
  r = await fetch(base + '/api/auth/login', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ email, password: pw }), redirect: 'manual'});
  const rawLoginHeaders = {};
  r.headers.forEach((v,k)=> rawLoginHeaders[k]=v);
  console.log({ status: r.status, headers: rawLoginHeaders });

  const setCookie = rawLoginHeaders['set-cookie'] || rawLoginHeaders['Set-Cookie'] || null;
  if (!setCookie) { console.error('No set-cookie received — login failed'); process.exit(1); }
  const m = setCookie.match(/token=([^;]+);/);
  const token = m ? m[1] : null;
  if (!token) { console.error('Failed to extract token from set-cookie'); process.exit(1); }
  const cookieHeader = `token=${token}`;
  console.log('EXTRACTED token length', token.length);

  console.log('\n3) Create product');
  r = await fetch(base + '/api/products', { method: 'POST', headers: { 'content-type':'application/json', Cookie: cookieHeader }, body: JSON.stringify({ name: 'E2E Product', price: 9.99, description: 'desc', image: '' }) });
  const create = await pretty(r); console.log(create);
  const id = create.body && create.body.product && create.body.product.id;
  console.log('created id', id);

  if (id) {
    console.log('\n4) Update product');
    r = await fetch(base + `/api/products/${id}`, { method: 'PATCH', headers: { 'content-type':'application/json', Cookie: cookieHeader }, body: JSON.stringify({ name: 'Updated E2E', price: 12 }) });
    console.log(await pretty(r));

    console.log('\n5) Delete product');
    r = await fetch(base + `/api/products/${id}`, { method: 'DELETE', headers: { Cookie: cookieHeader } });
    console.log(await pretty(r));
  }

  console.log('\n6) List products');
  r = await fetch(base + '/api/products');
  console.log(await pretty(r));
}

run().catch(e=>{ console.error('E2E runner failed', e); process.exit(1); });
