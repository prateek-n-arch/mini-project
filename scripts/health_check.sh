#!/usr/bin/env bash
curl -sSf http://localhost:8000/ || { echo "Backend not responding"; exit 1; }
curl -sSf http://localhost:5001/ || { echo "ML orchestrator not responding"; exit 1; }
echo "Services OK"
