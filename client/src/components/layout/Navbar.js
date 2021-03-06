import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth'
import { Fragment } from 'react'
const Navbar = ({ auth: {isAuthenticated, loading}, logout }) => {
  const authLinks = (
    <ul>
      <li><Link to="/profiles"> {' '}
       Developers
    </Link>
    </li>
    <li><Link to="/dashboard">
    <i className="fas fa-user"></i> {' '}
       <span className="hide-sm">Dashboard</span> 
    </Link>
    </li>
    <li><Link to="/posts">
    <i className="fas fa-user"></i> {' '}
       <span className="hide-sm">Posts</span> 
    </Link>
    </li>
    <li>
      <a href="/login"onClick={logout} className="mybtn">
      <i className="fas fa-sign-out-alt"></i> {' '}
        <span className="hide-sm"> Logout</span></a>
    </li>
    </ul>
  )
  const guestLinks = (
    <ul>
    <li><Link to="/register">
        register
    </Link>
    </li>
    <li><Link to="/login">
        login
    </Link>
    </li>
    <li><Link to="/register">
        developers
    </Link>
    </li>
  </ul> 
    )
    return (
        <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
            <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
     { !loading && (<Fragment> { isAuthenticated ? authLinks : guestLinks  } </Fragment>) }
    </nav>
    )
}

Navbar.propTypes ={
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logout}) (Navbar)