import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { 
  faPhone,
  faAt,
  faEnvelope,
  faHeadset,

} from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <>
    <MDBFooter  className='text-center text-lg-start text-muted bg-info text-light'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block text-secondary'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div className="d-flex flex-wrap flex-sm-row flex-row justify-content-center gap-3">

          <a href='' className='me-4 text-reset'>
            <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: "#ffffffff" }} />
          </a>
          <a href='' className='me-4 text-reset'>
            <FontAwesomeIcon icon={faXTwitter} size="2x" style={{ color: "#ffffffff" }} />
          </a>
          <a href='' className='me-4 text-reset'>
            <FontAwesomeIcon icon={faGoogle} size="2x" style={{ color: "#ffffffff" }} />
          </a>
          <a href='' className='me-4 text-reset '>
            <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: "#ffffffff" }} />
          </a>
          <a href='' className='me-4 text-reset'>
            <FontAwesomeIcon icon={faLinkedin} size="2x" style={{ color: "#ffffffff" }} />
          </a>
          <a href='' className='me-4 text-reset'>
            <FontAwesomeIcon icon={faGithub} size="2x" style={{ color: "#ffffffff" }} />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                Custom Rodzz
              </h6>
              <img src="https://www.shutterstock.com/image-vector/biker-riding-motorcycle-illustration-logo-260nw-2327228019.jpg" alt="" />
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4 text-light'>
              <h6 className='text-uppercase fw-bold mb-4'>ABOUT US</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Overview
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Company Vision
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Achievements
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Careers
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Contact Us
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4 text-light'>
              <h6 className='text-uppercase fw-bold mb-4'>SHOP</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Accessories
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Merchandise
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Genuine Parts
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  TRUE Oil
                </a>
              </p>
            </MDBCol>

            {/* <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                New York, NY 10012, US
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                info@example.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
              </p>
            </MDBCol> */}
          </MDBRow>
        </MDBContainer>
      </section>

      




      <div className="container">
        <footer style={{ backgroundColor: '#4968b01b' }} className="footer text-white py-4">
      <Container>
        <Row className="text-center text-md-start">
          <Col xs={12} md={6} lg={3} className="mb-3">
            <h6>CONTACT</h6>
            <p>
              <FontAwesomeIcon icon={faPhone}  style={{ color: "#ffffffff" }} />{' '}
              <a href="tel:18002587555" className="text-white text-decoration-underline">
                1800-258-7555
              </a>
            </p>
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-3">
            <h6>EMAIL</h6>
            <p>
              <FontAwesomeIcon icon={faEnvelope}  style={{ color: "#ffffffff" }} />{' '}
              <a href="mailto:customercare@tvsmotor.com" className="text-white text-decoration-underline">
                customercare@customrodz.com
              </a>
            </p>
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-3">
            <h6>CUSTOM RODZ CONNECT APP</h6>
            <p>
              <FontAwesomeIcon icon={faHeadset}   style={{ color: "#ffffffff" }}/>{' '}
              <a href="mailto:customrodzconnectsupport@tvsmotor.com" style={{overflowWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'normal'}} className="text-white text-decoration-underline">
              customrodzconnectsupport@customrodz.com
              </a>
            </p>
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-3">
            <h6>ROAD SIDE ASSISTANCE</h6>
            <p>
              🆘{' '}
              <a href="tel:18002587111" className="text-white text-decoration-underline">
                Dial 1800-258-7111 and Press “1”
              </a>
            </p>
          </Col>
        </Row>

        <hr className="border-light" />
        <Row className="text-center">
          <Col>
            <p className="mb-0">© Custom Rodz Company. All Rights Reserved</p>
            <div className="d-flex justify-content-center gap-3 mt-2 flex-wrap">
              <a href="/" className="text-white">Privacy Policy</a>
              <a href="/" className="text-white">Disclaimer</a>
              <a href="/" className="text-white">Cookie Policy</a>
            </div>
          </Col>
        </Row>

        <div className="text-center mt-3">
          <h6>FOLLOW US</h6>
          <div className="d-flex justify-content-center gap-3">
            <a href="/" className="text-white">X</a>
            <a href="/" className="text-white">LinkedIn</a>
            <a href="/" className="text-white">Facebook</a>
            <a href="/" className="text-white">Instagram</a>
            <a href="/" className="text-white">YouTube</a>
          </div>
        </div>
      </Container>
    </footer>
      </div>




      <div className='text-center p-4 text-secondary' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2025 Copyright:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
          Custom Rodz.com
        </a>
      </div>
    </MDBFooter>
    </>
  )
}

export default Footer