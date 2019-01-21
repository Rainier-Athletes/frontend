import React from 'react';
import PropTypes from 'prop-types';

import './subject-column.scss';

// export default function SubjectColumn(props) {
export default class SubjectColumn extends React.Component {
  /* eslint-disable */
  constructor(props) {
    // converted this component to a class in order to implement gradeClassName.
    // don't need state, but need props.
    super(props);
  };
  /* eslint-enable */

  handleDelete = () => {
    const { subjectName, teacher } = this.props.subject;
    this.props.deleteSubject(subjectName, teacher);
  };

  gradeClassName = (subject) => {
    if (subject.subjectName.toLowerCase() === 'tutorial') return 'grid-cell-hidden';
    return this.props.subject.grade !== null && this.props.subject.grade !== '' ? 'grid-input' : 'grid-input invalid-scores';
  };

  render() {
    return (
      <React.Fragment>
        <div className="grid-cell">{ this.props.subject.subjectName.toLowerCase() !== 'tutorial' 
          ? this.props.subject.teacher.lastName : '' }</div>
        <div className="grid-cell">{ this.props.subject.subjectName }</div>
        {
          Object.keys(this.props.subject.scoring)
            .map((markType, i) => {
              const { excusedDays, stamps, halfStamps } = this.props.subject.scoring;
              const validScores = this.props.subject.scoring[markType] !== null && this.props.subject.scoring[markType] !== ''
                && excusedDays >= 0 ? (stamps + halfStamps) <= (20 - excusedDays * 4) : false;
              return (
                <div className="grid-cell" key={ i }><input
                  type="number"
                  required
                  onChange={ this.props.handleSubjectChange }
                  className={validScores ? 'grid-input' : 'grid-input invalid-scores'}
                  name={ `${this.props.subject.subjectName}-${markType}` }
                  value={ this.props.subject.scoring[markType] === null ? '' : this.props.subject.scoring[markType]}
                /></div>);
            })
        }
        {this.props.isElementaryStudent ? null
          : <div className="grid-cell">
          <input
            type="text"
            className={this.gradeClassName(this.props.subject)}
            onChange={ this.props.handleSubjectChange }
            name={ `${this.props.subject.subjectName}-grade` }
            value={ this.props.subject.grade }
            required={this.props.subject.subjectName.toLowerCase() !== 'tutorial'}/>
        </div>}
        <div className={this.gradeClassName(this.props.subject)}>
            <button type="button" onClick={ this.handleDelete }>X</button>
        </div>
      </React.Fragment>
    );
  }
}

SubjectColumn.propTypes = {
  subject: PropTypes.object,
  handleSubjectChange: PropTypes.func,
  deleteSubject: PropTypes.func,
  isElementaryStudent: PropTypes.bool,
  editing: PropTypes.bool,
};
