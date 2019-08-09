import React, { Fragment, useRef, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

function Header() {
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">CMEC</NavbarBrand>
    </Navbar>
  );
}

export default Header;
