import React, { useContext, useState } from 'react';
import { useHistory, NavLink , Link } from 'react-router-dom';
import { UserContext } from '../App';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalBody,
    ListGroup,
    ListGroupItem
} from 'reactstrap';


const NavbarComponent = () => {

    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState([]);

    const toggle = () => setModal(!modal);

    const renderList = () => {
        if (state) {
            return [
                <NavItem key="1">
                    <NavLink onClick={toggle} className="nav-link" to="#">
                        <i className="material-icons">search</i>
                    </NavLink>
                </NavItem>,
                <NavItem key="2">
                    <NavLink className="nav-link" to="/">
                        <i className="material-icons">home</i>
                    </NavLink>
                </NavItem>,
                <UncontrolledDropdown key="4" nav inNavbar>
                    <DropdownToggle nav caret>
                        <i className="material-icons">account_circle</i>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <NavLink className="p-0" to="/profile">
                                Profile
                            </NavLink>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                            <span
                                onClick={() => {
                                localStorage.clear()
                                dispatch({type: "CLEAR"})
                                history.push('/login')
                                }}>
                                Logout
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>,
                <NavItem key="5">
                    <NavLink className="nav-link" to='/explore'>
                        <i className="material-icons">explore</i>
                    </NavLink>
                </NavItem>,
                <div key="6" className="floating-button d-flex">
                    <Link to="/create">
                        <div className="icon rounded-circle">
                            <i className="material-icons add">add</i>
                        </div>
                    </Link>
                </div>      
            ]
            
        }
        else {
            return [
                <NavItem key="7"><NavLink className="link mr-4" to="/login">Login</NavLink></NavItem>,
                <NavItem key="8"><NavLink className="link" to="/signup">SignUp</NavLink></NavItem>
            ]
        }
    }

    const Users = (query) => {
        setSearch(query)

        fetch('/user/search', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        })
        .then((res) => res.json())
        .then((result) => {
            setUser(result.user);
        })
        .catch((err) => {
            console.log(err)
        })

    }

    const close = () => {
        setSearch('')
        toggle()
    }


    return (
        <>
            <div>
                <Navbar className="shadow-sm p-0 navbar" color="white" fixed="top">
                    <div className="container">
                    <NavbarBrand tag={Link} className="brand" to={state? "/" : "/login"}>Felix</NavbarBrand>
                    <Nav>
                        {renderList()}
                    </Nav>
                    </div>
                </Navbar>
                <div>
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalBody>
                            <div className="mt-3">
                                <input
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter Username"
                                    value={search}
                                    onChange={(e) => Users(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <ListGroup>
                                    {
                                        user.map((item) => {
                                            return(
                                                <Link key={item._id} to={item._id !== state._id? `/profile/${item._id}`: "/profile"} onClick={() => close()}>
                                                    <ListGroupItem style={{border: "none"}}>
                                                        <img className="mr-2" style={{width: "10%", borderRadius: "50%"}} src={item.photo} alt={item.username} />
                                                        {item.username}
                                                    </ListGroupItem>
                                                </Link>
                                            )
                                        })
                                    }
                                </ListGroup>
                            </div>
                            <div className="mt-4">
                                <button className="btn btn-success" onClick={() => close()}>
                                    Close
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        </>
    );
}

export default NavbarComponent;