import React from 'react';
import './JoinSelector.css';

import { selectConnectionType } from '../../redux/actions';
import { joinOptions } from '../../constants';
import { connect } from 'react-redux';

class JoinSelector extends React.Component {
  joinOptionClicked = (type) => {
    if (type !== this.props.gameSelector.connectionType) {
      this.props.selectConnectionType({ connectionType: type });
    }
  };

  renderOptions = () => {
    return Object.keys(joinOptions).map((key, index) => {
      const selected =
        this.props.gameSelector.connectionType === key
          ? ' btn-primary'
          : ' btn-secondary';
      return (
        <button
          className={`join-selector-option btn${selected}`}
          onClick={() => this.joinOptionClicked(key)}
          key={index}
        >
          {joinOptions[key].label}
        </button>
      );
    });
  };

  render() {
    return <div className="join-selector-wrapper">{this.renderOptions()}</div>;
  }
}

const mapStateToProps = (state) => ({
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, { selectConnectionType })(JoinSelector);
