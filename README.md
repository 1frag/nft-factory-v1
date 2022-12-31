## Deployed contracts
Rinkeby:
* [0xFC57554207dcC3C19b1467831670c222a216C33f](https://rinkeby.etherscan.io/address/0xFC57554207dcC3C19b1467831670c222a216C33f) at [6767a33a](https://github.com/1frag/nft-factory-v1/commit/6767a33a6804b52a5c3c2ddcc705b31df6e5f676) - initial version
* [0x1686884f3e130A79e07c65Ef8f209E988a10792d](https://rinkeby.etherscan.io/address/0x1686884f3e130A79e07c65Ef8f209E988a10792d) at [2dd77bc3](https://github.com/1frag/nft-factory-v1/commit/2dd77bc34071a1d3e3dca511d556f8f4e57e833b) - changeable metadata source, fix mint v3/v4 to make sender of tx an owner of nft, add possibility to change name/symbol
* [0x43A141b05E6F213a6FAab9cEe4D95181858DF3aD](https://rinkeby.etherscan.io/address/0x43A141b05E6F213a6FAab9cEe4D95181858DF3aD) at [8fc9e79c](https://github.com/1frag/nft-factory-v1/commit/8fc9e79cba240f197d8d4b5938c7368658199a14) - support ERC1155 as metadata source
* [0xBA3570AB7e7592842d64B3B245AA92B7378f6513](https://rinkeby.etherscan.io/address/0xBA3570AB7e7592842d64B3B245AA92B7378f6513) at [9e058704](https://github.com/1frag/nft-factory-v1/commit/9e058704b22991a0f301fd77cc99002018c0a8fc) - fix support ERC1155 as metadata source (replace {id} to padded hex string)

Goerli:
* [0x72dFf987F504a1fa370Eeca424ccB256aE4a3A6d](https://goerli.etherscan.io/address/0x72dFf987F504a1fa370Eeca424ccB256aE4a3A6d) - add mintV5, mintV4 updated to add minted items, default sources are targeted to goerli
* [0xE1E37CAe8c93026ada3AE91328C94b11450967D0](https://goerli.etherscan.io/address/0xE1E37CAe8c93026ada3AE91328C94b11450967D0) - add mintV6, mintV7
* [0x6461B458D80FBaFB28A0C8Aa9F7445086995C9e6](https://goerli.etherscan.io/address/0x6461B458D80FBaFB28A0C8Aa9F7445086995C9e6) - add refresh, refreshAll
* [0xcd91221e5fc33733a0f6c6f6c2ca3b20b5b1505c](https://goerli.etherscan.io/address/0xcd91221e5fc33733a0f6c6f6c2ca3b20b5b1505c) - Builder for factories
* [0xf0255e9b2c831ea58e21156c529f65478380d764](https://goerli.etherscan.io/address/0xf0255e9b2c831ea58e21156c529f65478380d764) - Factory ERC-1155 (one of)
* [0x00000005F3b2EE253eA8f61ca2050278253B508e](https://goerli.etherscan.io/address/0x00000005F3b2EE253eA8f61ca2050278253B508e) - Proxy to factory builder implementation
* [0x056c9C070e5e592d7f5b890E9b65BAaffcA331C0](https://goerli.etherscan.io/address/0x056c9C070e5e592d7f5b890E9b65BAaffcA331C0) - Good metadata repository
* [0xA39D193E53Dddc64EB4b7258eCD104810B0D0669](https://goerli.etherscan.io/address/0xA39D193E53Dddc64EB4b7258eCD104810B0D0669) - Deterministic deploy factory
* [0x5e4cD0bbfC8f9A6D21BeAa6fCBc58FdC2e92A3AE](https://goerli.etherscan.io/address/0x5e4cD0bbfC8f9A6D21BeAa6fCBc58FdC2e92A3AE) - BuilderV1 with correct owner set
* [0x3384f9dd16a0d6F9043959b1E039257dA69554D6](https://goerli.etherscan.io/address/0x3384f9dd16a0d6F9043959b1E039257dA69554D6) - ComposableBuilderV1, added layer with builders
* [0x4A6624aE8293078cCC2DA70712980344c3438B8B](https://goerli.etherscan.io/address/0x4A6624aE8293078cCC2DA70712980344c3438B8B) - ComposableBuilderV1, added builderV4 with multiCreate
