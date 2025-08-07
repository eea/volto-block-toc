/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';

import { MaybeWrap } from '@plone/volto/components';
import withEEASideMenu from '@eeacms/volto-block-toc/hocs/withEEASideMenu';
import { normalizeString } from './helpers';
import './less/accordion-menu.less';

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = ({ data, tocEntries }) => {
  const { bulleted_list = false, side_menu = false } = data;
  const tocRef = useRef(); // Ref for the ToC component
  const spacerRef = useRef(); // Ref for the spacer div
  const [activeItems, setActiveItems] = useState({});
  //get relative offsetTop of an element
  function getOffsetTop(elem) {
    let offsetTop = 0;
    do {
      if (!isNaN(elem.offsetTop)) {
        offsetTop += elem.offsetTop;
      }
    } while ((elem = elem.offsetParent));
    return offsetTop;
  }

  useEffect(() => {
    const toc = tocRef.current; // ToC element
    const spacer = spacerRef.current; // Spacer div element
    //as side menu is sticky by-default
    if (data.sticky && !side_menu) {
      // const parent = toc.parentElement;
      const tocOffsetTop = toc ? getOffsetTop(toc) : 0;

      const updateTocWidthAndSpacer = () => {
        if (toc.classList.contains('sticky-toc')) {
          // Update the ToC width
          const parentStyle = window.getComputedStyle(toc.parentElement);
          const parentPaddingLeft = parseFloat(parentStyle.paddingLeft);
          const parentPaddingRight = parseFloat(parentStyle.paddingRight);
          const parentWidth =
            toc.parentElement.offsetWidth -
            parentPaddingLeft -
            parentPaddingRight +
            'px';
          toc.style.width = parentWidth;

          // Set the spacer height to fill the space when ToC is sticky
          spacer.style.height = `${toc.offsetHeight}px`;
        } else {
          spacer.style.height = '0px'; // Collapse the spacer when ToC is not sticky
        }
      };

      const handleScroll = () => {
        let scrollPos = window.scrollY;
        if (scrollPos > tocOffsetTop) {
          toc.classList.add('sticky-toc');
        } else {
          toc.classList.remove('sticky-toc');
        }
        updateTocWidthAndSpacer(); // Update width and spacer on scroll
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', updateTocWidthAndSpacer); // Update width and spacer on resize

      // Initially set spacer height if ToC is already sticky
      if (window.scrollY > tocOffsetTop) {
        toc.classList.add('sticky-toc');
        spacer.style.height = `${toc.offsetHeight}px`;
      }

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateTocWidthAndSpacer);
      };
    }
  }, [data.sticky, side_menu]);

  const RenderAccordionItems = ({ item }) => {
    const handleClick = (id, hasSubItems) => {
      if (hasSubItems) {
        setActiveItems((prevActiveItems) => ({
          ...prevActiveItems,
          [id]: !prevActiveItems[id],
        }));
      }
    };

    const { title, override_toc, plaintext, items: subItems, id, level } = item;
    const slug = override_toc
      ? Slugger.slug(normalizeString(plaintext))
      : Slugger.slug(normalizeString(title));

    const isActive = !!activeItems[id];
    const hasSubItems = subItems && subItems.length > 0;

    return (
      <MaybeWrap
        className={cx(`list-item level-${level}`, {
          'accordion-item': level > 2 && hasSubItems,
        })}
        condition={level > 2}
        as={(props) => <li key={id} {...props} />}
      >
        <Accordion fluid styled>
          <Accordion.Title
            active={isActive}
            onClick={() => handleClick(id, hasSubItems)}
          >
            {subItems && subItems.length > 0 && (
              <Icon name={isActive ? 'angle up' : 'angle right'} />
            )}
            <AnchorLink href={`#${slug}`}>{title}</AnchorLink>
          </Accordion.Title>
          {hasSubItems && (
            <Accordion.Content active={isActive}>
              <ul
                className={cx('accordion-list', {
                  'accordion-list-bulleted': bulleted_list,
                })}
              >
                {subItems.map((child) => RenderAccordionItems({ item: child }))}
              </ul>
            </Accordion.Content>
          )}
        </Accordion>
      </MaybeWrap>
    );
  };

  return (
    <>
      {data.title && !data.hide_title && (
        <h2>
          {data.title || (
            <FormattedMessage
              id="Table of Contents"
              defaultMessage="Table of Contents"
            />
          )}
        </h2>
      )}
      <div ref={spacerRef} /> {/* Spacer div */}
      <div ref={tocRef} className="accordionMenu">
        {tocEntries.map((item) => RenderAccordionItems({ item }))}
      </div>
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(injectIntl, (WrappedComponent) => (props) => {
  const { data, device } = props;
  const { side_menu = false, variation } = data;

  return (
    <MaybeWrap
      condition={side_menu}
      as={(wrapperProps) => {
        const wrapped = (innerProps) => (
          <div className={cx('table-of-contents', variation, device)}>
            <WrappedComponent {...innerProps} />
          </div>
        );
        const TocWithSideMenu = withEEASideMenu(wrapped);
        return (
          <TocWithSideMenu
            {...wrapperProps}
            shouldRender={props.tocEntries?.length > 0}
          />
        );
      }}
      {...props}
    >
      <WrappedComponent {...props} />
    </MaybeWrap>
  );
})(View);
