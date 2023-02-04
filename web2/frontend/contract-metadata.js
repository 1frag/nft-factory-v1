const CONTRACTS_METADATA = {
    hashesInfo: {
        '0x48680f6b2825c2b3f900087266aef8ddff2d25cbc6cc350f56794fe4d30f06cf': {
            type: 'ERC721',
            supportCrossChainMint: true,
        },
        '0x5c96f4a28a310dee7ce2f60f874e278fea6ed23b782df3f6a3ca8551c94cc058': {
            type: 'ERC1155',
            supportCrossChainMint: true,
        },
        '0x51755081a77a6dca2059d668e536a44e32719b865de8701a3e834c7cf9bd975f': {
            type: 'CondensedNFTs',
            supportCrossChainMint: true,
        },
        '0x18b92fcc7d11b8b35c02ff27e8160298725fdcab5e6e8fff12dd01cb75ca4fe4': {
            type: 'CondensedNFTs',
            supportCrossChainMint: true,
        },
        '0x5aaff3a9a632980732a646a77e85df8a5675432bf0f47fba76be8724f0c1d117': {
            type: 'ERC721Light',
        },
        '0x88b0000dd861c241a020d9b6ade7c04efe9655110f8a661e77c9355aea59a0ce': {
            type: 'ERC721Light'
        },
        '0x45ca9d22ce968921886646ed002b9a69ed9075d288a80777a43cf98c82ecf453': {
            type: 'CustomERC1155',
            supportCrossChainMint: true,
        },
        '0xdae87575f344a5e00c7053173e1e91dbc8c0f42da628f2ad8b448e77ccd02138': {
            type: 'CustomERC721',
            supportCrossChainMint: true,
        },
        '0xbbe6e267246a75b604fc9fe6a984c17b354a389981d293059673fdd31982d053': {
            type: 'CondensedNFTs',
            supportCrossChainMint: true,
        },
        '0x78c2b6cb5b50047faf823de9a37bb6f3b43372d36af0fef3eb06c971ca36206e': {
            type: 'Factory1155',
            supportCrossChainMint: true,
        },
        '0xb0cd0eb2a616d9493bbdf4cb9b0cf3013d004ee3d0f91c50a20c5316879589d8': {
            type: 'Factory721',
            supportCrossChainMint: true,
        },
        '0xfda9e815a804107adb177f97f30489605b7d6a62e88dfdd435727ea460a4f04d': {
            type: 'ERC20',
            supportCrossChainMint: true,
        }
    },
    builders: [
        '0xa2b7db50f8a6b2e23eb958c582fbda12719f6fbd',
        '0x053b9ec72fa9b74a827e23a1f5d6d9e23ddad77e',
        '0xc9441ac66f20d9531db922653a1bfef430b52213',
        '0xa0f115c93762af4473b09a93db99235332245715',
        '0x6f3a6cbefd6db1e326bcd48f22fa4ebe6cb3f827',
        '0x3ee15866477f799c04105a344a78f6571d8ccb85',
        '0x58b7e86a415ddb72f633f331dadc72d13a0c8e79',
        '0x29ca010f2833ea0dee364eb6202e7808a9d4c4ae',
        '0x175ee002175d04c04451847c11519d6749a03fb9',
        '0x92f9d9d29ba84839b98e539271bad64c033ff9d9',
        '0x7d2769ae8e2c7683bfbfe5fbe47c94c8a590f1d4',
        '0xa49b98fc7b546848145ebe50878c13bc49fbffa8',
        '0x79e1d2125314b1f40a70b4adc345bcffdadd8541',
        '0x077db2e79824d32642199541a8b802006d9040ea',
    ],
    hashByBuilder: {
        '0x3ee15866477f799c04105a344a78f6571d8ccb85': '0xdae87575f344a5e00c7053173e1e91dbc8c0f42da628f2ad8b448e77ccd02138',
        '0x7d2769ae8e2c7683bfbfe5fbe47c94c8a590f1d4': '0xb0cd0eb2a616d9493bbdf4cb9b0cf3013d004ee3d0f91c50a20c5316879589d8',
        '0x29ca010f2833ea0dee364eb6202e7808a9d4c4ae': '0x18b92fcc7d11b8b35c02ff27e8160298725fdcab5e6e8fff12dd01cb75ca4fe4',
        '0x053b9ec72fa9b74a827e23a1f5d6d9e23ddad77e': '0x5c96f4a28a310dee7ce2f60f874e278fea6ed23b782df3f6a3ca8551c94cc058',
        '0x58b7e86a415ddb72f633f331dadc72d13a0c8e79': '0x45ca9d22ce968921886646ed002b9a69ed9075d288a80777a43cf98c82ecf453',
        '0x077db2e79824d32642199541a8b802006d9040ea': '0xfda9e815a804107adb177f97f30489605b7d6a62e88dfdd435727ea460a4f04d',
        '0x79e1d2125314b1f40a70b4adc345bcffdadd8541': '0xbbe6e267246a75b604fc9fe6a984c17b354a389981d293059673fdd31982d053',
        '0x92f9d9d29ba84839b98e539271bad64c033ff9d9': '0x5aaff3a9a632980732a646a77e85df8a5675432bf0f47fba76be8724f0c1d117',
        '0x175ee002175d04c04451847c11519d6749a03fb9': '0x88b0000dd861c241a020d9b6ade7c04efe9655110f8a661e77c9355aea59a0ce',
        '0xa0f115c93762af4473b09a93db99235332245715': '0x48680f6b2825c2b3f900087266aef8ddff2d25cbc6cc350f56794fe4d30f06cf',
        '0xa2b7db50f8a6b2e23eb958c582fbda12719f6fbd': '0x48680f6b2825c2b3f900087266aef8ddff2d25cbc6cc350f56794fe4d30f06cf',
        '0xc9441ac66f20d9531db922653a1bfef430b52213': '0x51755081a77a6dca2059d668e536a44e32719b865de8701a3e834c7cf9bd975f',
        '0xa49b98fc7b546848145ebe50878c13bc49fbffa8': '0x78c2b6cb5b50047faf823de9a37bb6f3b43372d36af0fef3eb06c971ca36206e',
    },
};
