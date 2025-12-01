// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string course;
        uint256 date;
        bool valid;
    }

    mapping(address => Certificate) public certificates;

    function issueCertificate(
        address student,
        string memory studentName,
        string memory course,
        uint256 date
    ) public {
        certificates[student] = Certificate(studentName, course, date, true);
    }

    function verifyCertificate(address student) public view returns (bool) {
        return certificates[student].valid;
    }
}
