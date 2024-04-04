/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { List } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { toSlug } from '@eeacms/volto-anchors/helpers';
import { normalizeString } from './helpers';
import './less/accordion-menu.less';

const RenderListItems = ({ items, data }) => {
  return map(items, (item) => {
    const { id, level, title, override_toc, plaintext } = item;
    const slug = override_toc
      ? toSlug(normalizeString(plaintext))
      : toSlug(normalizeString(title)) || id;
    return (
      item && (
        <List.Item key={id} className={`item headline-${level}`} as="li">
          <AnchorLink href={`#${slug}`}>{title}</AnchorLink>
          {item.items?.length > 0 && (
            <List
              ordered={data.ordered}
              bulleted={!data.ordered}
              as={data.ordered ? 'ol' : 'ul'}
            >
              <RenderListItems items={item.items} data={data} />
            </List>
          )}
        </List.Item>
      )
    );
  });
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
      {data.title && !data.hide_title ? (
        <h2>
          {data.title || (
            <FormattedMessage
              id="Table of Contents"
              defaultMessage="Table of Contents"
            />
          )}
        </h2>
      ) : (
        ''
      )}
      <List
        ordered={data.ordered}
        bulleted={!data.ordered}
        as={data.ordered ? 'ol' : 'ul'}
      >
        <RenderListItems items={tocEntries} data={data} />
      </List>
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
