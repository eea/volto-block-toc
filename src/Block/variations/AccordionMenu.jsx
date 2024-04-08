/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import { toSlug } from '@eeacms/volto-anchors/helpers';
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
          ? toSlug(normalizeString(plaintext))
          : toSlug(normalizeString(title));

        const isActive = !!activeItems[index];
        const hasSubItems = subItems && subItems.length > 0;

        return (
          <React.Fragment key={index}>
            <Accordion.Title
              active={isActive}
              onClick={() => handleClick(index, hasSubItems)}
            >
              {subItems && subItems.length > 0 && (
                <Icon name="dropdown" className={isActive ? 'rotated' : ''} />
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
  useEffect(() => {
    if (data.sticky) {
      const toc = document.querySelector('.accordionMenu');
      const tocPos = toc ? toc.offsetTop : 0;
      const tocHeight = toc ? toc.getBoundingClientRect().top : 0;

      const handleScroll = () => {
        let scrollPos = window.scrollY;
        if (scrollPos > tocPos + tocHeight && toc) {
          toc.classList.add('sticky-toc');
        } else if (scrollPos <= tocPos + tocHeight && toc) {
          toc.classList.remove('sticky-toc');
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
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
      <RenderAccordionItems items={tocEntries} data={data} />
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
