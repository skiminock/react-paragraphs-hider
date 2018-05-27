import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paragraph from '../Paragraph/Paragraph.js';

export default class Paragraphs extends Component {
    wrapper;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRenderParagraph = this.onRenderParagraph.bind(this);
        this.calcRestrictedHeight = this.calcRestrictedHeight.bind(this);
        this.calcParagraphHeight = this.calcParagraphHeight.bind(this);
        this.makeId = this.makeId.bind(this);

        this.renderedParagraphs = [];
        this.paragraphs =
            (
                this.props.paragraphs &&
                this.props.paragraphs.map(p => {
                    return {
                        text: p,
                        id: this.makeId()
                    };
                })
            ) || [];
        this.state = {
            paragraphs: [],

            height: null,
            fullHeight: null,
            restrictedHeight: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.renderedParagraphs = [];
        this.paragraphs =
            (
                nextProps.paragraphs &&
                nextProps.paragraphs.map(p => {
                    return {
                        text: p,
                        id: this.makeId()
                    };
                })
            ) || [];
        this.setState({
            paragraphs: [],

            height: null,
            fullHeight: null,
            restrictedHeight: null
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.paragraphs.length === this.props.paragraphs.length &&
            this.state.paragraphs.length !== prevState.paragraphs.length
        ) {
            const restrictedHeight = this.calcRestrictedHeight(this.state.paragraphs);

            this.setState({
                height: restrictedHeight,
                fullHeight: parseInt(window.getComputedStyle(this.wrapper).height, 10),
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

    calcRestrictedHeight(paragraphs) {
        const tmpParagraphs = paragraphs.sort((p1, p2) => {
            return p1.index > p2.index;
        });

        let newTotalHeight = 0;
        for(let i = 0; i < tmpParagraphs.length; ++i) {
            const tmpParagraph = tmpParagraphs[i];
            const result = this.calcParagraphHeight(
                newTotalHeight,
                tmpParagraph.styles
            );
            newTotalHeight = result.newTotalHeight;
            if (result.needBreak) break;
        }
        return newTotalHeight;
    }

    calcParagraphHeight(totalHeight, styles) {
        let newTotalHeight = totalHeight;

        const { restrictedHeight } = this.props;
        const {
            height,
            lineHeight,
            marginTop,
            marginBottom,
            paddingTop,
            paddingBottom
        } = styles;

        const parsedHeight = parseInt(height, 10);
        const parsedLineHeight = parseInt(lineHeight, 10);
        const parsedMarginTop = parseInt(marginTop, 10);
        const parsedMarginBottom = parseInt(marginBottom, 10);
        const parsedPaddingTop = parseInt(paddingTop, 10);
        const parsedPaddingBottom = parseInt(paddingBottom, 10);

        newTotalHeight += parsedMarginTop;
        if (newTotalHeight >= restrictedHeight) {
            return  { newTotalHeight, needBreak: true };
        }

        newTotalHeight += parsedPaddingTop;
        if (newTotalHeight >= restrictedHeight) {
            return  { newTotalHeight, needBreak: true };
        }

        const lines = parsedHeight / parsedLineHeight;

        let needBreak = false;
        for(let i = 0; i < lines; ++i) {
            newTotalHeight += parsedLineHeight;
            if (newTotalHeight >= restrictedHeight) {
                needBreak = true;
                break;
            }
        }
        if (needBreak) return  { newTotalHeight, needBreak: true };

        newTotalHeight += parsedPaddingBottom;
        if (newTotalHeight >= restrictedHeight) {
            return  { newTotalHeight, needBreak: true };
        }

        newTotalHeight += parsedMarginBottom;
        if (newTotalHeight >= restrictedHeight) {
            return  { newTotalHeight, needBreak: true };
        }

        return  { newTotalHeight, needBreak: false };
    }

    makeId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {
        const { paragraphClassName, toggleWrapperClassName, toggleShow, toggleHide } = this.props;
        const { height, fullHeight, restrictedHeight } = this.state;

        const innerStyle = {
            overflowY: 'hidden',
            width: '100%',
        };
        if (height) {
            innerStyle.height = `${height}px`;
        }

        return (
            <div style={{ width: '100%', visibility: height ? 'visible' : 'hidden' }}>
                <div
                    style={innerStyle}
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
                {(fullHeight !== restrictedHeight) &&
                    <div className={toggleWrapperClassName} onClick={this.toggle} style={{ width: '100%' }}>
                        {(height === fullHeight) ? toggleHide : toggleShow}
                    </div>
                }
            </div>
        );
    }
}

Paragraphs.propTypes = {
    paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
    restrictedHeight: PropTypes.number.isRequired,

    paragraphClassName: PropTypes.string,

    toggleWrapperClassName: PropTypes.string,
    toggleShow: PropTypes.node.isRequired,
    toggleHide: PropTypes.node.isRequired,
};
