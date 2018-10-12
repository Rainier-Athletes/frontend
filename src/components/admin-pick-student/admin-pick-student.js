import React from 'react';
import PropTypes from 'prop-types';

export default function AdminPickStudent(props) {
  return (
  <form onChange={props.onChange}>
    <div className="field-wrap dropdown">
      <label className="title" htmlFor="student">Select student:</label>
        <select type="student" required>
          <option value="" selected="true" disabled> -- select a student -- </option>
          {
            props.students
              .filter(s => s.studentData) // only show students with defined studentData object
              .sort((p1, p2) => {
                if (p1.lastName > p2.lastName) return 1;
                if (p1.lastName < p2.lastName) return -1;
                return 0;
              })
              .map((p) => {
                return <option key={p._id} value={p._id}>
                  {p.lastName}, {p.firstName}
                </option>;
              })
          }
        </select>
    </div>
    <div>
      Note: Only students with associated student data are listed.
    </div>
  </form>
  );
}

AdminPickStudent.propTypes = {
  onChange: PropTypes.func,
  students: PropTypes.array,
};
