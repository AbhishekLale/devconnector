import React, {  useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'

const AddEducation = ( {addEducation,history} ) => {
    const [formData,setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        descripion: ''
    })

    const [toDateDisabled, toggleDisabled] = useState(false)

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = formData

    const onChange = e => setFormData( {...formData, [e.target.name] : [e.target.value].toString()} )

    return (
        <div>
            <h1 className="large text-primary">
       Add An Education
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any School/Bootcamp
         that you have attendend
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit = { e => {
          e.preventDefault()
          addEducation(formData,history)
      } }>
        <div className="form-group">
          <input type="text" placeholder="* Degree or certificate" name="degree" value={degree} onChange = { e => onChange(e) }  />
        </div>
        <div className="form-group">
          <input type="text" placeholder="* school/bootcamp" name="school" value={school} onChange = { e => onChange(e) }  />
        </div>
        <div className="form-group"> 
          <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange = { e => onChange(e) } />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange = { e => onChange(e) }/>
        </div>
         <div className="form-group">
          <p><input
          type="checkbox"
          checked ={current}
          name="current" 
          value={current}  
          onChange = { e => {
          setFormData({ ...formData, current: !current })
          toggleDisabled(!toDateDisabled)
          }}/> 
          {' '}Current School/Collage</p>
        </div>
        <div className="form-group"> 
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange = { e => onChange(e) } disabled = { toDateDisabled ? 'disabled' : '' }  />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description} onchange = { e => onChange(e) }
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
        </div>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null,{addEducation}) (AddEducation)
