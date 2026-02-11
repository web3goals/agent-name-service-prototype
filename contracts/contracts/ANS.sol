// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract ANS is ERC721, Ownable {
    // ============================================
    // STORAGE
    // ============================================

    string private _imageURI;
    mapping(uint256 => string) private _names;
    mapping(uint256 => string) private _personalities;

    // ============================================
    // EVENTS & ERRORS
    // ============================================

    event NameUpdated(uint256 indexed tokenId, string newName);
    event PersonalityUpdated(uint256 indexed tokenId, string newPersonality);
    event ImageURIUpdated(string newImageURI);

    error InvalidInput(string reason);
    error Unauthorized();

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(
        string memory initialImageURI
    ) ERC721("Agent Name Service", "ANS") Ownable(msg.sender) {
        _imageURI = initialImageURI;
    }

    // ============================================
    // PUBLIC VIEW FUNCTIONS
    // ============================================

    function imageURI() public view returns (string memory) {
        return _imageURI;
    }

    function getTokenId(string memory name) public pure returns (uint256) {
        return uint256(keccak256(bytes(name)));
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function names(uint256 tokenId) public view returns (string memory) {
        return _names[tokenId];
    }

    function personalities(
        uint256 tokenId
    ) public view returns (string memory) {
        return _personalities[tokenId];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory personality = _personalities[tokenId];
        string memory name = _names[tokenId];

        // Construct JSON
        // Note: _validateInput ensures name/personality don't contain quotes that break JSON
        bytes memory dataURI = bytes(
            string.concat(
                "{",
                '"name": "',
                name,
                '",',
                '"description": "An official identity in the Agent Name Service (ANS) ecosystem.",',
                '"image": "',
                _imageURI,
                '",',
                '"attributes": [',
                '{"trait_type": "Name", "value": "',
                name,
                '"},',
                '{"trait_type": "Personality", "value": "',
                personality,
                '"}',
                "]",
                "}"
            )
        );

        return
            string.concat(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            );
    }

    // ============================================
    // PUBLIC FUNCTIONS
    // ============================================

    // Allow the Token Owner (or Approved) to update their Agent's name
    function setName(uint256 tokenId, string memory name) public {
        _requireOwned(tokenId);

        // Allow Owner of token OR Contract Owner (optional admin override)
        if (_ownerOf(tokenId) != msg.sender && owner() != msg.sender) {
            revert Unauthorized();
        }

        _validateInput(name);
        _names[tokenId] = name;

        emit NameUpdated(tokenId, name);
    }

    // Allow the Token Owner (or Approved) to update their Agent's personality
    function setPersonality(uint256 tokenId, string memory personality) public {
        _requireOwned(tokenId);

        // Allow Owner of token OR Contract Owner (optional admin override)
        if (_ownerOf(tokenId) != msg.sender && owner() != msg.sender) {
            revert Unauthorized();
        }

        _validateInput(personality);
        _personalities[tokenId] = personality;

        emit PersonalityUpdated(tokenId, personality);
    }

    // ============================================
    // OWNER FUNCTIONS
    // ============================================

    function safeMint(
        address to,
        string memory name,
        string memory personality
    ) public onlyOwner returns (uint256) {
        _validateInput(name);
        _validateInput(personality);

        uint256 tokenId = getTokenId(name);

        // _safeMint already checks if token exists
        _safeMint(to, tokenId);

        _names[tokenId] = name;
        _personalities[tokenId] = personality;

        return tokenId;
    }

    function setImageURI(string memory newImageURI) public onlyOwner {
        _imageURI = newImageURI;
        emit ImageURIUpdated(newImageURI);
    }

    // ============================================
    // INTERNAL FUNCTIONS
    // ============================================

    // Simple validation to prevent JSON injection and empty strings
    function _validateInput(string memory str) internal pure {
        bytes memory b = bytes(str);
        if (b.length == 0) revert InvalidInput("Empty string");
        if (b.length > 100) revert InvalidInput("Too long");

        for (uint i; i < b.length; i++) {
            if (b[i] == '"' || b[i] == "\\" || b[i] < 0x20) {
                revert InvalidInput("Invalid character");
            }
        }
    }
}
