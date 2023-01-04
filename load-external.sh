#!/bin/bash
# Download nibbstack/erc721
curl https://github.com/nibbstack/erc721/archive/refs/heads/master.zip -Lo erc721.zip
unzip erc721.zip
mkdir -p contracts/external/nibbstack/erc721
mv erc721-master/src contracts/external/nibbstack/erc721
rm -rf erc721-master
rm -rf erc721.zip
# Increase supported version in EllipticCurve
sed -i 's/pragma solidity >=0.5.3 <0.7.0;/pragma solidity >=0.5.3 <0.9.0;/' ./node_modules/elliptic-curve-solidity/contracts/EllipticCurve.sol
