// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

// TODO: Ensure each name is unique and minted only once (use names as token IDs)
contract ANS is ERC721, Ownable {
    // ============================================
    // STORAGE
    // ============================================
    string private _imageURI;
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _names;
    mapping(uint256 => string) private _personalities;

    // ============================================
    // CONSTRUCTOR
    // ============================================
    constructor(
        string memory initialImageURI
    ) ERC721("Agent Name Service", "ANS") Ownable(msg.sender) {
        _nextTokenId = 1;
        _imageURI = initialImageURI;
    }

    // ============================================
    // PUBLIC VIEW FUNCTIONS
    // ============================================

    function imageURI() public view returns (string memory) {
        return _imageURI;
    }

    function nextTokenId() public view returns (uint256) {
        return _nextTokenId;
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

        bytes memory dataURI = bytes(
            string.concat(
                "{",
                '"name": "',
                _names[tokenId],
                '",',
                '"description": "An official identity in the Agent Name Service (ANS) ecosystem.",',
                '"image": "',
                _imageURI,
                '",',
                '"attributes": [',
                '{"trait_type": "Name", "value": "',
                _names[tokenId],
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
    // OWNER FUNCTIONS
    // ============================================

    function safeMint(
        address to,
        string memory name,
        string memory personality
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _names[tokenId] = name;
        _personalities[tokenId] = personality;
        return tokenId;
    }

    function setImageURI(string memory newImageURI) public onlyOwner {
        _imageURI = newImageURI;
    }

    function setPersonality(
        uint256 tokenId,
        string memory personality
    ) public onlyOwner {
        _personalities[tokenId] = personality;
    }

    function setName(uint256 tokenId, string memory name) public onlyOwner {
        _names[tokenId] = name;
    }
}
