import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paragraph from '../Paragraph/Paragraph.js';

export default class Paragraphs extends Component {
    renderedParagraphs;
    paragraphs;
    wrapper;

    init(flag, props) {
        this.renderedParagraphs = [];

        this.paragraphs =
            (props.paragraphs && props.paragraphs.map(p => ({ text: p, id: this.makeId() }))) || [];

        const state = {
            paragraphs: [],

            height: null,
            fullHeight: null,
            restrictedHeight: null
        };

        if (flag) {
            this.state = state;
        } else {
            this.setState(state);
        }
    }

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRenderParagraph = this.onRenderParagraph.bind(this);
        this.calcTotalRestrictedHeight = this.calcTotalRestrictedHeight.bind(this);
        this.calcParagraphRestrictedHeight = this.calcParagraphRestrictedHeight.bind(this);
        this.calcHeightNearRestrictedHeight = this.calcHeightNearRestrictedHeight.bind(this);
        this.makeId = this.makeId.bind(this);
        this.init = this.init.bind(this);

        this.init(true, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.init(false, nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        debugger;
        const paragraphIds = this.state.paragraphs.map(p => p.id).sort();
        const prevParagpraphIds = (prevState.paragraphs && prevState.paragraphs.map(p => p.id).sort()) || [];

        if (
            paragraphIds.length === this.props.paragraphs.length &&
            paragraphIds.toString() !== prevParagpraphIds.toString()
        ) {
            const restrictedHeight = this.calcTotalRestrictedHeight(this.state.paragraphs);
            const fullHeight = parseInt(window.getComputedStyle(this.wrapper).height, 10);

            this.setState({
                height: restrictedHeight,
                fullHeight,
                restrictedHeight,
            });
        }
    }

    toggle() {
        this.setState({
            height: this.state.height === this.state.fullHeight ? this.state.restrictedHeight : this.state.fullHeight
        });
    }

    onRenderParagraph(index, styles, text, id) {
        const renderedParagraph = this.renderedParagraphs.find(p => p.id === id);
        if (!renderedParagraph) {
            this.renderedParagraphs = this.renderedParagraphs.concat({
                index,
                styles,
                text,
                id
            });
            if (this.renderedParagraphs.length === this.paragraphs.length) {
                this.setState({
                    paragraphs: this.renderedParagraphs
                });
            }
        }
    }

    calcTotalRestrictedHeight(paragraphs) {
        const tmpParagraphs = paragraphs.sort((p1, p2) => {
            return p1.index > p2.index;
        });

        let newTotalHeight = 0;

        for (let i = 0; i < tmpParagraphs.length; ++i) {
            const tmpParagraph = tmpParagraphs[i];
            const result = this.calcParagraphRestrictedHeight(
                newTotalHeight,
                tmpParagraph.styles
            );
            newTotalHeight = result.newTotalHeight;
            if (result.needBreak) break;
        }

        return newTotalHeight;
    }

    calcParagraphRestrictedHeight(totalHeight, styles) {
        let result;
        let newTotalHeight = totalHeight;

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

        result = this.calcHeightNearRestrictedHeight(newTotalHeight, parsedMarginTop);
        if (result.needBreak) {
            return result;
        } else {
            newTotalHeight = result.newTotalHeight;
        }

        result = this.calcHeightNearRestrictedHeight(newTotalHeight, parsedPaddingTop);
        if (result.needBreak) {
            return result;
        } else {
            newTotalHeight = result.newTotalHeight;
        }

        const lines = parsedHeight / lineHeight;

        for (let i = 0; i < lines; ++i) {
            result = this.calcHeightNearRestrictedHeight(newTotalHeight, lineHeight);
            if (result.needBreak) {
                return result;
            } else {
                newTotalHeight = result.newTotalHeight;
            }
        }

        result = this.calcHeightNearRestrictedHeight(newTotalHeight, parsedPaddingBottom);
        if (result.needBreak) {
            return result;
        } else {
            newTotalHeight = result.newTotalHeight;
        }

        result = this.calcHeightNearRestrictedHeight(newTotalHeight, parsedMarginBottom);
        if (result.needBreak) {
            return result;
        } else {
            newTotalHeight = result.newTotalHeight;
        }

        return { newTotalHeight, needBreak: false };
    }

    calcHeightNearRestrictedHeight(totalHeight, toAdd) {
        const { restrictedHeight } = this.props;
        const newTotalHeight = totalHeight + toAdd;

        if (newTotalHeight >= restrictedHeight) {
            const belowBorder = restrictedHeight - totalHeight;
            const aboveBorder = newTotalHeight - restrictedHeight;

            if (belowBorder < aboveBorder) {
                return { newTotalHeight: totalHeight, needBreak: true };
            }
            return { newTotalHeight, needBreak: true };
        }

        return { newTotalHeight, needBreak: false };
    }

    makeId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 10; ++i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {
        debugger;
        const { wrapperClassName, paragraphsClassName, paragraphClassName, toggleClassName, toggleShow, toggleHide } = this.props;
        const { height, fullHeight, restrictedHeight } = this.state;

        const paragraphsStyle = {
            overflowY: 'hidden',
        };
        if (height) {
            paragraphsStyle.height = `${height}px`;
        }

        return (
            <div className={wrapperClassName}
                 style={{ visibility: height ? 'visible' : 'hidden' }}
            >
                <div
                    className={paragraphsClassName}
                    style={paragraphsStyle}
                    ref={wrapper => this.wrapper = wrapper}
                >
                    {
                        this.paragraphs.map((p, i) =>
                            <Paragraph
                                className={paragraphClassName}
                                key={p.id}
                                id={p.id}
                                index={i}
                                text={p.text}
                                onRender={this.onRenderParagraph}
                            />
                        )
                    }
                </div>
                {fullHeight !== restrictedHeight &&
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

    wrapperClassName: PropTypes.string,
    paragraphsClassName: PropTypes.string,
    paragraphClassName: PropTypes.string,
    toggleClassName: PropTypes.string,

    toggleShow: PropTypes.node.isRequired,
    toggleHide: PropTypes.node.isRequired,
};
