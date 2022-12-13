interface IFactory {
    function renameContract (string calldata name, string calldata symbol) external;
    function mintV1 (address _to, string calldata _uri) external;
    function mintV2 (string calldata _uri) external;
    function mintV3 () external;
    function mintV4 (address contractAddress, uint tokenId) external;
    function mintV5 (string calldata name, string calldata image) external;
    function mintV6 (address contractAddress, uint fromTokenId, uint toTokenId) external;
    function mintV7 (uint n) external;
    function refresh (uint tokenId) external;
    function refreshAll () external;
    function changeMetadata (uint256 _tokenId, string calldata _uri) external;
    function changeMetadataBatch (uint256 _left, uint256 _right, string calldata _uri) external;
    function transfer (address _to, uint256 _tokenId) external;
}
