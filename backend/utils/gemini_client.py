from typing import Optional

import google.generativeai as genai
from loguru import logger

from .config import get_settings

_gemini_client: Optional[genai.GenerativeModel] = None


def get_gemini_client() -> Optional[genai.GenerativeModel]:
    global _gemini_client
    if _gemini_client:
        return _gemini_client

    settings = get_settings()
    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY not set; returning None client.")
        return None

    genai.configure(api_key=settings.gemini_api_key)
    _gemini_client = genai.GenerativeModel(settings.gemini_model)
    return _gemini_client

