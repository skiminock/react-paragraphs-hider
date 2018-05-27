import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Paragraphs extends Component {
    wrapper;

    static defaultProps = {
        toggleFlag: true
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.calcRealRestrictedHeight = this.calcRealRestrictedHeight.bind(this);
        this.calcParagraphRestrictedHeight = this.calcParagraphRestrictedHeight.bind(this);
        this.calcBelowOrAboveRestrictedHeight = this.calcBelowOrAboveRestrictedHeight.bind(this);
        this.makeId = this.makeId.bind(this);

        this.state = {
            paragraphs: [],

            height: null,
            fullHeight: null,
            realRestrictedHeight: null
        };
    }

    componentWillReceiveProps(nextProps) {
        const paragraphs =
            nextProps.paragraphs ? nextProps.paragraphs.map(p => ({ text: p, id: this.makeId() })) : [];

        this.setState({
            paragraphs,

            height: null,
            fullHeight: null,
            realRestrictedHeight: null
        });
    }

    componentDidMount() {
        const paragraphs =
            this.props.paragraphs ? this.props.paragraphs.map(p => ({ text: p, id: this.makeId() })) : [];

        this.setState({
            paragraphs
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const paragraphIds = this.state.paragraphs.map(p => p.id).sort();
        const prevParagpraphIds = prevState.paragraphs.map(p => p.id).sort();

        if (
            paragraphIds.length === this.props.paragraphs.length &&
            paragraphIds.toString() !== prevParagpraphIds.toString()
        ) {
            const children = this.wrapper.children;

            if (children && children.length) {
                const paragraphStyles = [];
                for (let i = 0; i < children.length; ++i) {
                    paragraphStyles.push(window.getComputedStyle(children[i]));
                }

                const realRestrictedHeight = this.calcRealRestrictedHeight(paragraphStyles);
                const fullHeight = parseInt(window.getComputedStyle(this.wrapper).height, 10);

                this.setState({
                    height: this.props.toggleFlag ? realRestrictedHeight : fullHeight,
                    fullHeight,
                    realRestrictedHeight,
                });
            }
        }
    }

    toggle() {
        this.setState({
            height:
                this.state.height === this.state.fullHeight ?
                    this.state.realRestrictedHeight :
                    this.state.fullHeight
        });
    }

    calcRealRestrictedHeight(paragraphStyles) {
        let realRestrictedHeight = 0;

        for (let i = 0; i < paragraphStyles.length; ++i) {
            const result = this.calcParagraphRestrictedHeight(
                realRestrictedHeight,
                paragraphStyles[i]
            );
            realRestrictedHeight = result.realRestrictedHeight;

            if (result.needBreak) break;
        }

        return realRestrictedHeight;
    }

    calcParagraphRestrictedHeight(h, styles) {
        let result;
        let realRestrictedHeight = h;

        const { lineHeight } = this.props;
        const {
            height,
            marginTop,
            marginBottom,
            paddingTop,
            paddingBottom
        } = styles;

        const parsedHeight = parseInt(height, 10);
        const parsedMarginTop = parseInt(marginTop, 10);
        const parsedMarginBottom = parseInt(marginBottom, 10);
        const parsedPaddingTop = parseInt(paddingTop, 10);
        const parsedPaddingBottom = parseInt(paddingBottom, 10);

        result = this.calcBelowOrAboveRestrictedHeight(realRestrictedHeight, parsedMarginTop);
        if (result.needBreak) {
            return result;
        } else {
            realRestrictedHeight = result.realRestrictedHeight;
        }

        result = this.calcBelowOrAboveRestrictedHeight(realRestrictedHeight, parsedPaddingTop);
        if (result.needBreak) {
            return result;
        } else {
            realRestrictedHeight = result.realRestrictedHeight;
        }

        const lines = parsedHeight / lineHeight;

        for (let i = 0; i < lines; ++i) {
            result = this.calcBelowOrAboveRestrictedHeight(realRestrictedHeight, lineHeight);
            if (result.needBreak) {
                return result;
            } else {
                realRestrictedHeight = result.realRestrictedHeight;
            }
        }

        result = this.calcBelowOrAboveRestrictedHeight(realRestrictedHeight, parsedPaddingBottom);
        if (result.needBreak) {
            return result;
        } else {
            realRestrictedHeight = result.realRestrictedHeight;
        }

        result = this.calcBelowOrAboveRestrictedHeight(realRestrictedHeight, parsedMarginBottom);
        if (result.needBreak) {
            return result;
        } else {
            realRestrictedHeight = result.realRestrictedHeight;
        }

        return { realRestrictedHeight, needBreak: false };
    }

    calcBelowOrAboveRestrictedHeight(height, toAdd) {
        const { restrictedHeight } = this.props;
        const realRestrictedHeight = height + toAdd;

        if (realRestrictedHeight >= restrictedHeight) {
            const belowBorderDiff = restrictedHeight - height;
            const aboveBorderDiff = realRestrictedHeight - restrictedHeight;

            if (belowBorderDiff < aboveBorderDiff) {
                return { realRestrictedHeight: height, needBreak: true };
            }
            return { realRestrictedHeight, needBreak: true };
        }

        return { realRestrictedHeight, needBreak: false };
    }

    makeId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 10; ++i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {
        const {
            wrapperClassName,
            paragraphsClassName,
            paragraphClassName,
            toggleClassName,
            toggleShow,
            toggleHide
        } = this.props;

        const {
            paragraphs,
            height,
            fullHeight,
            realRestrictedHeight
        } = this.state;

        const paragraphsStyle = {
            overflowY: 'hidden',
        };
        if (height) {
            paragraphsStyle.height = `${height}px`;
        }

        return (
            <div className={wrapperClassName}
                 style={{ visibility: (height ? 'visible' : 'hidden') }}
            >
                <div
                    className={paragraphsClassName}
                    style={paragraphsStyle}
                    ref={wrapper => this.wrapper = wrapper}
                >
                    {
                        paragraphs.map(p =>
                            <div
                                className={paragraphClassName}
                                key={p.id}
                                id={p.id}
                            >
                                {p.text}
                            </div>
                        )
                    }
                </div>
                {fullHeight !== realRestrictedHeight &&
                    <div
                        className={toggleClassName}
                        onClick={this.toggle}
                    >
                        {height === fullHeight ? toggleHide : toggleShow}
                    </div>
                }
            </div>
        );
    }
}

Paragraphs.propTypes = {
    paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
    restrictedHeight: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    toggleShow: PropTypes.node.isRequired,
    toggleHide: PropTypes.node.isRequired,

    wrapperClassName: PropTypes.string,
    paragraphsClassName: PropTypes.string,
    paragraphClassName: PropTypes.string,
    toggleClassName: PropTypes.string,

    toggleFlag: PropTypes.bool,
};
