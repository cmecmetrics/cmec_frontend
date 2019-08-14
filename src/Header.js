import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";

function Header() {
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">CMEC</NavbarBrand>
    </Navbar>
  );
}

export default Header;
