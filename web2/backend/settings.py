from pydantic import BaseSettings


class Settings(BaseSettings):
    rpc_url: str


settings = Settings(_env_file='../../.env')
