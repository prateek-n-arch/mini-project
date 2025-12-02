# backend/app/services/ml_orchestrator.py
import os
import httpx

ML_ORCH_URL = os.environ.get("ML_ORCH_URL", "http://localhost:5001")

async def call_ml_orchestrator(payload: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{ML_ORCH_URL}/infer", json=payload, timeout=20.0)
        resp.raise_for_status()
        return resp.json()
