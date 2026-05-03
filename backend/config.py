import os

from dotenv import load_dotenv
from autogen.beta.config import OpenAIConfig

load_dotenv()

_api_key = os.environ["OPENROUTER_API_KEY"]
_base_url = "https://openrouter.ai/api/v1"

lead_config = OpenAIConfig(
    model="google/gemini-2.5-pro",
    streaming=True,
    api_key=_api_key,
    base_url=_base_url,
    max_completion_tokens=16384,
)

worker_config = OpenAIConfig(
    model="google/gemini-2.5-flash",
    streaming=True,
    api_key=_api_key,
    base_url=_base_url,
)
