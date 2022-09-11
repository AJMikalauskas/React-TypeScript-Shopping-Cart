import { Container, Button, Nav, Navbar as NavBarBs } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";

export default function Navbar() {
    const { openCart, cartQuantity } = useShoppingCart();
  return (
    <NavBarBs sticky="top" className="bg-white shadow-sm mb-3">
      <Container>
            <Nav className="me-auto">
                <Nav.Link to={"/"} as={NavLink}>Home</Nav.Link>
                <Nav.Link to={"/store"} as={NavLink}>Store</Nav.Link>
                <Nav.Link to={"/about"} as={NavLink}>About</Nav.Link>
            </Nav>
            {/* Can define inline styles by such: style={{ width: "3rem", height: "3rem"}} */}
            <Button onClick={openCart} variant="outline-primary" className="rounded-circle">
                <img src="https://img.icons8.com/fluency/48/000000/shopping-cart.png"/>
                <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                style={{
                     color:"white",
                     width:"1.5rem",
                    // height:"1.5rem",
                     position:"absolute",
                     bottom: 0,
                     right: 125,
                    // transform: "translate(25%, 25%)",
                }}>{cartQuantity}</div>
            </Button>
      </Container>
    </NavBarBs>
  )
}
