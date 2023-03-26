class HiddenItemsService {
    loading() {
        this._promise = getHiddenItems().then(items => {
            this._addrToOwner = items.reduce((acc, item) => ({
                ...acc,
                [item.contract_address.toLowerCase()]: item.owner,
            }), {});
        });
    }

    async waitLoading() {
        await this._promise;
    }

    isHidden(contractAddress) {
        const owner = this._addrToOwner[contractAddress.toLowerCase()];
        return this._owner ? this._owner !== owner : !!owner;
    }

    setTargetOwner(owner) {
        this._owner = owner;
    }

    owner() {
        return this._owner;
    }
}
