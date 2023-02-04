from pydantic import BaseSettings


class Settings(BaseSettings):
    goerli_rpc_url: str
    mainnet_rpc_url: str
    resolver_url: str


settings = Settings(_env_file='../../.env')
