import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

function CustomNavbar() {
  return (
    <Navbar sticky="top" expand="lg" style={{ backgroundColor: 'lightgreen'}}>
      <Container>
        <Navbar.Brand href="/home" style={{fontSize: '1.8rem'}} >NutriGen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ">
            <Nav.Link href="/home" style={{fontSize: '1.5rem'}}>Home</Nav.Link>
            <Nav.Link href="/about" style={{fontSize: '1.5rem'}}>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
