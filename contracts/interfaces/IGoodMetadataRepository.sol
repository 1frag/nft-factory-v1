interface IGoodMetadataRepository {
    function add(
        address contractAddress,
        uint tokenId,
        bool throwError
    ) external;

    function remove(uint index) external;

    function get() external returns (address, uint);

    function hashState() external view returns (uint);
}
