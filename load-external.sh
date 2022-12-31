#!/bin/bash
curl https://github.com/nibbstack/erc721/archive/refs/heads/master.zip -Lo erc721.zip
unzip erc721.zip
mkdir -p contracts/external/nibbstack/erc721
mv erc721-master/src contracts/external/nibbstack/erc721
rm -rf erc721-master
rm -rf erc721.zip
