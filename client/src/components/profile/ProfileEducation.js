import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({education: {school, degree, fieldofstudy, to, from, description}}) => {
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                <Moment format = "YYYY/DD/MM">{from}</Moment> - {!to ? 'Now' : <Moment format = "YYYY/DD/MM">{to}</Moment>}
            </p>
            <p>
                <strong>Degree: </strong> {degree}
            </p>
            <p>
                <strong>Field of study: </strong> {fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong> {description}
            </p>
        </div>
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired,
}

export default ProfileEducation