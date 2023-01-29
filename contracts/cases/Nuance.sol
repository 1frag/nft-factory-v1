// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Status: Draft

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../libraries/Heap.sol";

contract NuanceLeaderBoard is ERC721 {
    address public currency;
    bool initiated;

    constructor() ERC721("NuanceLeaderBoard", "nuance") {}

    function setCurrency() external {
        require(currency == address(0), "Already set");
        currency = msg.sender;
    }

    function ensureCurrencyContract() internal {
        require(
            msg.sender == currency,
            "You are not allowed to manage token ownership"
        );
    }

    function setLeaders(address[] memory leaders) public {
        ensureCurrencyContract();
        for (uint index; index < leaders.length; index++) {
            uint tokenId = index + 1;
            address from = _ownerOf(tokenId);
            address leader = leaders[index];
            if (from != leader) {
                if (from == address(0)) {
                    _mint(leader, tokenId);
                } else if (leader == address(0)) {
                    _burn(tokenId);
                } else {
                    _transfer(from, leader, tokenId);
                }
            }
        }
    }

    function _beforeTokenTransfer(
        address,
        address,
        uint256,
        uint256
    ) internal override {
        ensureCurrencyContract();
    }
}

contract NuanceCurrency is ERC20 {
    address public leaderBoard;

    using Heap for Heap.Data;
    Heap.Data public data;

    mapping(uint => address) idToAddress;
    mapping(address => uint) addressToId;

    constructor() ERC20("NuanceCurrency", "nuance") {}

    function setLeaderBoard(address _leaderBoard) external {
        require(leaderBoard == address(0), "Already set");
        leaderBoard = _leaderBoard;
        NuanceLeaderBoard(leaderBoard).setCurrency();
    }

    function mint(uint amount) external {
        require(amount < 200 * (10 ** 18), "Not allowed <200");
        _mint(msg.sender, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._afterTokenTransfer(from, to, amount);

        data.extractById(addressToId[from]);
        data.extractById(addressToId[to]);

        uint fromIndex = data.insert(balanceOf(from)).id;
        uint toIndex = data.insert(balanceOf(to)).id;

        idToAddress[fromIndex] = from;
        idToAddress[toIndex] = to;

        addressToId[from] = fromIndex;
        addressToId[to] = toIndex;

        address[] memory leaders = new address[](10);
        for (uint index = 1; index <= 10; index++) {
            uint id = data.extractMax().id;
            leaders[index - 1] = idToAddress[id];
            idToAddress[id] = address(0);
            addressToId[idToAddress[id]] = 0;
        }
        NuanceLeaderBoard(leaderBoard).setLeaders(leaders);

        for (uint i; i < 10; i++) {
            uint leaderId = data.insert(balanceOf(leaders[i])).id;
            idToAddress[leaderId] = leaders[i];
            addressToId[leaders[i]] = leaderId;
        }
    }
}
