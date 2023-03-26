import requests

from settings import settings
from utils import rpc_command


class EthereumRepository:
    @staticmethod
    def get_transaction_initiator(transaction_hash: str) -> str:
        return requests.post(
            settings.goerli_rpc_url,
            json=rpc_command(
                method='eth_getTransactionByHash',
                params=[transaction_hash],
            )
        ).json()['result']['from'].lower()

    @staticmethod
    def get_transaction_logs(transaction_hash: str) -> list:
        return requests.post(
            settings.goerli_rpc_url,
            json=rpc_command(
                method='eth_getTransactionReceipt',
                params=[transaction_hash],
            )
        ).json()['result']['logs']
