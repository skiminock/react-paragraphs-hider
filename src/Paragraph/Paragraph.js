import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Paragraph extends Component {
    wrapper;

    componentDidMount() {
        const { index, text, onRender, id } = this.props;
        const styles = window.getComputedStyle(this.wrapper);
        onRender(index, styles, text, id);
    }

    componentDidUpdate() {
        const { index, text, onRender, id } = this.props;
        const styles = window.getComputedStyle(this.wrapper);
        onRender(index, styles, text, id);
    }

    render() {
        const { className, text } = this.props;
        return (
            <div className={className} ref={wrapper => this.wrapper = wrapper}>
                {text}
            </div>
        );
    }
}

Paragraph.propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onRender: PropTypes.func.isRequired,
    className: PropTypes.string
};
