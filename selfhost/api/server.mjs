import http from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import argon2 from 'argon2';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const origin = process.env.PUBLIC_ORIGIN;
if (!origin || !process.env.DATABASE_URL) throw new Error('PUBLIC_ORIGIN and DATABASE_URL required');

await pool.query(`CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`);
await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
)`);

function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(x => x.trim().split('=').slice(0, 2)).filter(x => x.length === 2));
}
const hash = s => createHash('sha256').update(s).digest('hex');
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) throw new Error('Request too large');
  }
  return JSON.parse(raw || '{}');
}
function sessionCookie(value, age) {
  return `transitos_session=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${age}`;
}
const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/health' && req.method === 'GET') return json(res, 200, { status: 'ok' });
    if (req.url === '/api/auth/me' && req.method === 'GET') {
      const token = cookies(req).transitos_session;
      if (!token) return json(res, 401, { error: 'Unauthenticated' });
      const found = await pool.query('SELECT u.id,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()', [hash(token)]);
      return found.rowCount ? json(res, 200, { user: found.rows[0] }) : json(res, 401, { error: 'Unauthenticated' });
    }
    if (['/api/auth/register', '/api/auth/login', '/api/auth/logout'].includes(req.url) && req.method === 'POST') {
      if (req.headers.origin !== origin) return json(res, 403, { error: 'Origin not allowed' });
      if (req.url === '/api/auth/logout') {
        const token = cookies(req).transitos_session;
        if (token) await pool.query('DELETE FROM sessions WHERE token_hash=$1', [hash(token)]);
        return json(res, 200, { ok: true }, { 'set-cookie': sessionCookie('', 0) });
      }
      const input = await body(req);
      const email = String(input.email || '').trim().toLowerCase();
      const password = input.password;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 12 || password.length > 128) return json(res, 400, { error: 'Valid email and password of 12-128 characters required' });
      let user;
      if (req.url === '/api/auth/register') {
        try {
          const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
          const result = await pool.query('INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING id,email', [email,passwordHash]);
          user = result.rows[0];
        } catch (e) {
          if (e.code === '23505') return json(res, 409, { error: 'Account already exists' });
          throw e;
        }
      } else {
        const result = await pool.query('SELECT id,email,password_hash FROM users WHERE email=$1', [email]);
        if (!result.rowCount || !(await argon2.verify(result.rows[0].password_hash, password))) return json(res, 401, { error: 'Invalid credentials' });
        user = { id: result.rows[0].id, email: result.rows[0].email };
      }
      const token = randomBytes(32).toString('hex');
      await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '7 days')", [hash(token), user.id]);
      return json(res, 200, { user }, { 'set-cookie': sessionCookie(token, 604800) });
    }
    return json(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('API request failed', err);
    return json(res, 500, { error: 'Internal server error' });
  }
});
server.listen(3000, '0.0.0.0');
