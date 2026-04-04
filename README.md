# Markr

A web-based AI grading tool. Paste a rubric, paste a submission, get structured scores and feedback for each criterion — consistent every time.

**Video Url**: https://www.loom.com/share/4469aa8e59114b3081decb5a8cdb9723 

> Built for user who want decent AI-powered submission feedback.

## How it works

- Create a grading thread and paste your rubric — Markr uses AI to parse it into structured criteria automatically
- The rubric is locked once the thread is created
- Paste any assigment submission and click Grade — the AI evaluates the full submission against all criteria in one call and returns a score and feedback per criterion
- Results are saved to the thread and viewable in the history sidebar

## APIs used

- **[Groq API](https://console.groq.com/docs/openai)** — used for both rubric parsing and submission grading. Two models are in use:
  - `llama-3.1-8b-instant` for rubric parsing (fast, lightweight)
  - `llama-3.3-70b-versatile` for grading (more accurate, consistent with `temperature: 0`)
- **[Neon](https://neon.tech/docs/introduction)** — serverless PostgreSQL used to persist threads, rubrics, and grading results

API keys are stored in a `.env` file. See setup instructions below.

## Running locally

**Requirements:** Node.js 22+

```bash
npm install
```

Create a `.env.local` file in the project root:

```
DATABASE_URL=a_postgress_connection_string
GROQ_API_KEY=your_groq_api_key
HOST=127.0.0.1
PORT=3000
```

Then start the server:

```bash
npm start
```

Open `http://127.0.0.1:3000`.

## Deployment

The app is deployed on two web servers behind a load balancer:

- **Web01** and **Web02** — Node.js servers running the app under PM2
- **Lb01** — nginx load balancer distributing traffic between the two servers using round-robin

### Server setup (Web01 and Web02)

1. Install Node.js via nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
```

2. Install PM2:

```bash
npm install -g pm2
```

3. Clone the repo and install dependencies:

```bash
mkdir -p /var/www/markr
cd /var/www/markr
git clone https://github.com/imenarh/markr .
npm install --omit=dev
```

4. Create a `.env` file at `/var/www/markr/.env`:

```
DATABASE_URL=your_neon_connection_string
GROQ_API_KEY=your_groq_api_key
HOST=0.0.0.0
PORT=3000
```

5. Start the app:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Load balancer setup (Lb01)

nginx config at `/etc/nginx/sites-available/markr`:

```nginx
upstream markr {
    server <WEB01_IP>:3000;
    server <WEB02_IP>:3000;
}

server {
    server_name markr.0xherve.tech;

    location / {
        proxy_pass http://markr;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

SSL is handled by Certbot. Traffic from clients hits Lb01 over HTTPS; Lb01 forwards to Web01/Web02 over plain HTTP on the internal network (SSL termination at the load balancer).

Enable and reload:

```bash
ln -s /etc/nginx/sites-available/markr /etc/nginx/sites-enabled/markr
nginx -t
systemctl reload nginx
```

### CI/CD

Pushing to `main` automatically deploys to both servers via GitHub Actions (`.github/workflows/deploy.yml`). The workflow SSHes into Web01 and Web02 in parallel, pulls the latest code, installs dependencies, and reloads PM2.

Required GitHub secrets: `WEB01_HOST`, `WEB02_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`.

## Challenges

- **IPv6 connectivity in WSL2** — the `pg` driver tried to connect to Neon over IPv6, which WSL2 doesn't route reliably. Fixed locally by appending `?family=4` to `DATABASE_URL` to force IPv4. Not needed on the VPS servers.
- **AI output consistency** — early testing with `openai/gpt-oss-120b`gave different scores for the same submission across runs. Switched to `temperature: 0` and `llama-3.3-70b-versatile` for stable, deterministic grading.
- **AI schema drift** — the 8B parse model occasionally returned `max_points` as a string instead of a number. Fixed by normalizing parsed criteria on the server before returning them to the client.

## Credits

- [Groq](https://groq.com) — LLM inference API
- [Neon](https://neon.tech) — serverless Postgres
- [Meta Llama](https://llama.meta.com) — underlying models (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`)
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action) — GitHub Actions SSH deploy
