import React, { Component } from 'react';

import noop from 'lodash/noop';

class AnchorLink extends Component {
  constructor(props) {
    super(props);
    this.link = React.createRef();
    this.getOffset = this.getOffset.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.smoothScroll = this.smoothScroll.bind(this);
  }

  componentDidMount() {
    require('smoothscroll-polyfill').polyfill();
  }
  getOffset() {
    if (typeof this.props.offset !== 'undefined') {
      if (
        !!(
          this.props.offset &&
          this.props.offset.constructor &&
          this.props.offset.apply
        )
      ) {
        return this.props.offset;
      }
      return parseInt(this.props.offset);
    }
    return 0;
  }
  onScroll(e) {
    // Scrolling
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(
      () => {
        // Scroll done
        document.removeEventListener('scroll', this.onScroll);
        if (!this.link.current) return;
        const id = this.link.current.getAttribute('href').slice(1);
        const $anchor = document.getElementById(id);
        if (!$anchor) return;
        const offsetTop =
          $anchor.getBoundingClientRect().top +
          window.scrollY -
          this.getOffset();
        if (offsetTop - window.scrollY > 5) {
          document.addEventListener('scroll', this.onScroll);
          window.scroll({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      },
      50,
      e,
    );
  }
  smoothScroll(e) {
    e.preventDefault();
    if (!this.link.current) return;
    const id = this.link.current.getAttribute('href').slice(1);
    const $anchor = document.getElementById(id);
    if (!$anchor) return;
    const offsetTop =
      $anchor.getBoundingClientRect().top + window.scrollY - this.getOffset();
    document.addEventListener('scroll', this.onScroll);
    window.scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    const { offset, children, ...rest } = this.props;
    return (
      <a
        {...rest}
        ref={this.link}
        role="link"
        tabIndex={0}
        onClick={this.smoothScroll}
        onKeyUp={noop}
      >
        {children}
      </a>
    );
  }
}

export default AnchorLink;
