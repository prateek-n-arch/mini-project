# backend/app/services/fusion.py
from typing import Dict, Any

def fuse_modalities(results: Dict[str, Dict[str, Any]], weights: Dict[str, float] = None):
    """
    results example:
      {"text": {"emotion":"sad","confidence":0.8}, "audio": {"emotion":"neutral","confidence":0.6}}
    This function picks highest confidence weighted outcome (simplified).
    """
    if not weights:
        weights = {k: 1.0 for k in results.keys()}
    best = None
    best_score = -1
    for mod, res in results.items():
        score = res.get("confidence", 0.0) * weights.get(mod, 1.0)
        if score > best_score:
            best_score = score
            best = {"emotion": res.get("emotion"), "confidence": score, "modality": mod}
    return best
