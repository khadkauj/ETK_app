import Modal from "react-bootstrap/Modal";
import Head from "next/head";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "next/image";
import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import ABI from "../../Contract/ABI.json";
import { ethers } from "ethers";

// IPFS details
const projectId = "2P4qS1ZUL7xTPLJS3NTipkdnW6U";
const projectSecret = "5ea6490b5b82d000ca8b1154bcf98c5c";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function Home() {
  const [fileName, setFileName] = useState(null);
  const [hashes1, setHash1] = useState([]);
  const [hashes2, setHash2] = useState([]);
  const [arrayOfSectionsOfFile, setArrayOfSectionsOfFile] = useState([]);
  const [knowledgeModelName1, setKnowledgeModelName1] = useState("");
  const [knowledgeModelName2, setKnowledgeModelName2] = useState("");
  const [contract, setContract] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const contractAddress = "0xE3e29e25CbBFDe7EE3B6B608876E2439093b97AC";

  // connects to metamask
  const connectToMetamask = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          // connectToETH(result[0]);
          console.log("Connected to metamask", result);
          setWalletAddress(result);
          getContract();
        })
        .catch((error) => {
          console.log("error while logging in metamask", error);
        });
    } else {
      console.log("Need to install MetaMask");
    }
  };

  // Fetch Solidity contract
  const getContract = async (newAccount) => {
    console.log("Connecting to Contract");
    try {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const address = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const ETKContract = new ethers.Contract(contractAddress, ABI, signer);
      console.log(ETKContract);
      setContract(ETKContract);
    } catch (error) {
      console.log("problems while assigning network", error);
    }
  };

  const splitFileContentIntoSections = (fileContent) => {
    const sections = fileContent
      .split(/\n\n/)
      .filter((section) => section.trim() !== "");
    return sections;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file);
    console.log("Uploading file:", file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const sections = splitFileContentIntoSections(fileContent);
      console.log("Sections:", sections);
      setArrayOfSectionsOfFile(sections.map((section) => section));
    };
    reader.readAsText(file);
  };

  const generateHash = (e, index) => {
    console.log("index is", e, index);
    e.preventDefault();
    if (!fileName) {
      console.log("No file selected");
      return;
    }
    console.log("starting to generate hash for text file:", fileName.name);

    if (index === 0) {
      setHash1([]);
    } else if (index === 1) {
      setHash2([]);
    }

    arrayOfSectionsOfFile.forEach((section, indx) => {
      console.log("adding to ipfs, section: ", section);

      // https://ipfs.io/ipfs/QmTX9pz6msTrYNXLtau49c4qEoG9m6epNzvTh6ick24Xgi
      const url = ipfs
        .add(section)
        .then((res) => {
          const url = "https://ipfs.io/ipfs/" + res.path;
          console.log(`url for section ${indx} is:`, url);
          if (index === 0) {
            setHash1((prevHash) => [...prevHash, url]);
          } else if (index === 1) {
            setHash2((prevHash) => [...prevHash, url]);
          }
        })
        .catch((error) => {
          console.log("error is:", error);
        });
    });
  };

  const storeInBlockchain = async(e, index) => {
    e.preventDefault();
    if (!hashes1 & !hashes2) {
      console.log("No file or hash");
      return;
    }

    const hashes = index === 0 ? hashes1 : hashes2
    const name = index === 0 ? knowledgeModelName1 : knowledgeModelName2
    const deviceId = "device"+index

    try {
      const addKM = contract.addKnowledgeModel(deviceId, name, hashes)
      console.log("Added Knowledge Model", addKM);
    } catch (error) {
      console.log("Error:", error);
    }

  };

  useEffect(() => {
    connectToMetamask()
  }, []);

  console.log("Hahes1", hashes1);
  console.log("Hahes2", hashes2);
  console.log("Hahes2", knowledgeModelName1);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/* Header */}
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">ETK</Navbar.Brand>
            {!walletAddress ? (
              <Button onClick={connectToMetamask} size="lg" variant="primary">
                Signup With Metamask
              </Button>
            ) : (
              "Wallet Address: " + walletAddress
            )}
          </Container>
        </Navbar>
        {/* Devices */}

        <Container>
          <Row>
            {/* First Device */}
            <Col key={1}>
              <div
                className="modal show"
                style={{ display: "block", position: "initial" }}
              >
                <Modal.Dialog size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Device 0</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <div style={{ display: "grid", placeItems: "center" }}>
                      <Image
                        src="/KM.png"
                        alt="Picture of the author"
                        width={50}
                        height={50}
                      />
                    </div>
                    {/* Generate Hash Form */}
                    <Form>
                      <Row className="align-items-center">
                        <Col sm={9}>
                          <Form.Group controlId="knowledgeModelFile">
                            <Form.Label>Upload Knowledge Model</Form.Label>
                            <Form.Control
                              type="file"
                              accept=".txt"
                              onChange={handleFileUpload}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={3}>
                          <Button
                            style={{ marginTop: "32px" }}
                            type="submit"
                            size="sm"
                            onClick={(e) => generateHash(e, 0)}
                          >
                            Generate Hash
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    {/* Show hashes after hashes are generated */}
                    {hashes1.length > 0 && (
                      <Card body>
                        Hashes Generated:
                        <br />
                        {hashes1.map((hash) => hash + "\n")}
                      </Card>
                    )}
                    <br />
                    {/* Store in Blockchain */}
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name of Knowledge Model</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name of Knowledge Model"
                          onChange={(e) =>
                            setKnowledgeModelName1(e.target.value)
                          }
                        />
                      </Form.Group>

                      {hashes1.length > 0 && (
                        <Button
                          onClick={(e) => storeInBlockchain(e, 0)}
                          variant="primary"
                          type="submit"
                          disabled={!knowledgeModelName1}
                        >
                          Store in Blockchain
                        </Button>
                      )}
                    </Form>
                  </Modal.Body>

                  <Modal.Footer></Modal.Footer>
                </Modal.Dialog>
              </div>
            </Col>
            {/* Second Device */}
            <Col key={2}>
              <div
                className="modal show"
                style={{ display: "block", position: "initial" }}
              >
                <Modal.Dialog size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Device 1</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <div style={{ display: "grid", placeItems: "center" }}>
                      <Image
                        src="/KM.png"
                        alt="Picture of the author"
                        width={50}
                        height={50}
                      />
                    </div>
                    {/* Generate Hash Form */}
                    <Form>
                      <Row className="align-items-center">
                        <Col sm={9}>
                          <Form.Group controlId="knowledgeModelFile">
                            <Form.Label>Upload Knowledge Model</Form.Label>
                            <Form.Control
                              type="file"
                              accept=".txt"
                              onChange={handleFileUpload}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={3}>
                          <Button
                            style={{ marginTop: "32px" }}
                            type="submit"
                            size="sm"
                            onClick={(e) => generateHash(e, 1)}
                          >
                            Generate Hash
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    {/* Show hashes after hashes are generated */}
                    {hashes2.length > 0 && (
                      <Card body>
                        Hashes Generated:
                        <br />
                        {hashes2.map((hash) => hash + "\n")}
                      </Card>
                    )}
                    <br />
                    {/* Store in Blockchain */}
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name of Knowledge Model</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name of Knowledge Model"
                          onChange={(e) =>
                            setKnowledgeModelName2(e.target.value)
                          }
                        />
                      </Form.Group>

                      {hashes2.length > 0 && (
                        <Button
                          onClick={(e) => storeInBlockchain(e, 1)}
                          variant="primary"
                          type="submit"
                          disabled={!knowledgeModelName1}
                        >
                          Store in Blockchain
                        </Button>
                      )}
                    </Form>
                  </Modal.Body>

                  <Modal.Footer></Modal.Footer>
                </Modal.Dialog>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
