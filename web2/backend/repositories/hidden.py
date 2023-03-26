from constants import HIDDEN_KEY
from storage import storage


class HiddenRepository:
    key = HIDDEN_KEY

    @staticmethod
    def prettier(values):
        def filtered():
            seen = set()
            for value in values:
                key = f'{value["contract_address"]}:{value["owner"]}'
                if key not in seen:
                    seen.add(key)
                    yield value

        return sorted(filtered(), key=lambda v: v['owner'])

    def add(self, contract_address: str, owner: str):
        storage.append(
            self.key,
            {
                'contract_address': contract_address.lower(),
                'owner': owner.lower(),
            },
        ).save_key_with(
            self.key,
            self.prettier,
        )

    def list(self):
        return storage.get(self.key)

    def remove(self, contract_address: str, owner: str):
        storage.remove(
            self.key,
            {
                'contract_address': contract_address.lower(),
                'owner': owner.lower(),
            },
        ).save_key_with(
            self.key,
            self.prettier,
        )
