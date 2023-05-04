import { useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";

function KMIteration({ KMFromBlockchain, KMFromBlockchain2 }) {
  console.log("from inside", KMFromBlockchain);
  const [show, setShow] = useState(false);

  if (KMFromBlockchain.length === 0) {
    return <>No Knowledge model available</>;
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const modalStyle = {
    maxWidth: "90%",
    width: "90%",
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Show Knowledge Models
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Knowledge Model interation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Device 0 */}
            <Col>
              <Modal.Dialog style={modalStyle}>
                <Modal.Header closeButton>
                  <Modal.Title>Device0</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {KMFromBlockchain[0][0]}
                  <br />
                  {KMFromBlockchain[0][1]}
                  <br />
                  {KMFromBlockchain[0][2].map((elem) => (
                    <>
                      {elem}
                      <br />
                    </>
                  ))}
                </Modal.Body>
              </Modal.Dialog>
            </Col>
            {/* Device 1 */}
            <Col>
              <Modal.Dialog style={modalStyle}>
                <Modal.Header closeButton>
                  <Modal.Title>Device1</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {KMFromBlockchain2[0][0]}
                  <br />
                  {KMFromBlockchain2[0][1]}
                  <br />
                  {KMFromBlockchain2[0][2].map((elem) => (
                    <>
                      {elem}
                      <br />
                    </>
                  ))}{" "}
                </Modal.Body>
              </Modal.Dialog>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Interact
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KMIteration;
