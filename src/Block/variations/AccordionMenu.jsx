/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import './less/accordion-menu.less';

const RenderAccordionItems = ({ items }) => {
  const [activeItems, setActiveItems] = useState({});

  const handleClick = (index, hasSubItems) => {
    if (hasSubItems) {
      setActiveItems((prevActiveItems) => ({
        ...prevActiveItems,
        [index]: !prevActiveItems[index],
      }));
    }
  };

  return (
    <Accordion fluid styled>
      {items.map((item, index) => {
        const { title, override_toc, plaintext, items: subItems } = item;
        const slug = override_toc
          ? Slugger.slug(normalizeString(plaintext))
          : Slugger.slug(normalizeString(title));

        const isActive = !!activeItems[index];
        const hasSubItems = subItems && subItems.length > 0;

        return (
          <React.Fragment key={index}>
            <Accordion.Title
              active={isActive}
              onClick={() => handleClick(index, hasSubItems)}
            >
              {subItems && subItems.length > 0 && (
                <Icon name={isActive ? 'angle up' : 'angle right'} />
              )}
              <AnchorLink href={`#${slug}`}>{title}</AnchorLink>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
              {subItems && subItems.length > 0 && (
                <RenderAccordionItems items={subItems} />
              )}
            </Accordion.Content>
          </React.Fragment>
        );
      })}
    </Accordion>
  );
};

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = ({ data, tocEntries }) => {
  const tocRef = useRef(); // Ref for the ToC component
  const spacerRef = useRef(); // Ref for the spacer div
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
    if (data.sticky) {
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
  }, [data.sticky]);

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
        <RenderAccordionItems items={tocEntries} data={data} />
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

export default injectIntl(View);
