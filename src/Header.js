import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";

function Header() {
  return (
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://cmec.llnl.gov/">
          <img src="cmec_logo.png" alt="CMEC Logo" width="112" height="28" /> <span>CMEC</span>
        </a>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
    </nav>
  );
}

export default Header;
