#!/usr/bin/env bash
set -e
echo "Ensure docker-compose is up. Then run sample curl"
curl -X POST "http://localhost:8000/api/v1/auth/anonymous" -H "Content-Type: application/json"
curl -X POST "http://localhost:8000/api/v1/chat/text" -H "Content-Type: application/json" -d '{"text":"I am sad"}'
