// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract ETK{

    struct KnowledgeModel{
        string name;
        string[] hashes;
    }

    // mapping from DeviceId(string) to KnowledgeModel(struct)

    mapping(string => KnowledgeModel) private deviceKnowledgeModel;

    // Add KM for specific device
    function addKnowledgeModel(string memory deviceId, string memory name, string[] memory hashes ) public {
        deviceKnowledgeModel[deviceId] = KnowledgeModel(name, hashes);
    }

    // retrieve knowledge model for specific device
    function getKnowledgeModel(string memory deviceId) public view returns(string memory, string memory, string[] memory) {
        KnowledgeModel storage model = deviceKnowledgeModel[deviceId];
        return (deviceId, model.name, model.hashes);
    }

}