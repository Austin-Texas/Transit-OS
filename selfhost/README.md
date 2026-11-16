# TransitOS self-hosted API (development staging only)

This is an initial independent PostgreSQL and authentication API scaffold. It is **not** connected to the frontend and **not production-ready**. Do not expose the API publicly or direct users to register until frontend integration, reverse-proxy routing, rate limits, email verification, password recovery, CSRF protections, migrations, backup/restore and end-to-end tests are completed.

To stage on app-host-01, create a private .env inside selfhost with TRANSITOS_DB_PASSWORD set to a long random secret. Do not commit it. Run docker compose up -d --build from selfhost. The API has no published host port and only the shared Docker edge network can reach it as http://api:3000 inside its Compose project network. The database is accessible only on the internal Docker network.

Never reuse TPMCS or ASVAB database credentials. Never treat a 200 frontend page as proof authentication works.
