# Deploy the API on Oracle Cloud (Always Free)

On hold: Oracle asks for a card to verify the account, and the owner does not want to add one. Hosting waits for DigitalOcean (see DECISIONS.md). This guide stays for reference.

Free tier for development and early testing. It is not for launch traffic: the instance can be reclaimed if it sits idle, and backups are yours to run. Move to DigitalOcean with a `pg_dump` when that matters (see DECISIONS.md).

## What you do (owner)

1. Create an Oracle Cloud account at cloud.oracle.com. Oracle asks for a card to verify identity; it is not charged within Always Free limits. Choose the home region (closest to Mexico City is fine).
2. Create a compute instance:
   - Image: Canonical Ubuntu 22.04 or 24.04.
   - Shape: Ampere (VM.Standard.A1.Flex), 1 OCPU and 6 GB RAM is enough to start. Always Free covers up to 4 OCPU and 24 GB in total.
   - Networking: public IPv4 address, SSH key (generate one on your Mac: `ssh-keygen -t ed25519`).
   - Advanced options, Initialization script: paste the contents of `infra/oracle/cloud-init.yaml`.
3. In the VCN's security list, add an ingress rule: TCP 80 from 0.0.0.0/0.
4. Tell me the public IP. I will not ask for the SSH key or any password.

## Deploy (run on the server)

```sh
ssh ubuntu@<PUBLIC_IP>
# The repo is private: add a read-only deploy key on GitHub (repo Settings, Deploy keys) first.
git clone git@github.com:Fercho-Barrera/vuelo.git && cd vuelo/backend
```

Put the Rails master key on the server (it is not in the repo): copy `backend/config/master.key` from your Mac with `scp` or paste it into `config/master.key`. Then create `.env` from the example:

```sh
cp .env.example .env
# fill POSTGRES_PASSWORD (any long random string) and RAILS_MASTER_KEY (contents of config/master.key)
docker compose -f docker-compose.prod.yml up -d --build
```

Check it:

```sh
curl -s -o /dev/null -w "%{http_code}\n" http://<PUBLIC_IP>/up   # expect 200
```

## Later

- HTTPS needs a domain. Point it at the IP and put Caddy in front of the API for automatic certificates.
- Backups: a nightly `pg_dump` copied off the VM.
- The `docker-compose.prod.yml` file is the same setup that will run on DigitalOcean.
