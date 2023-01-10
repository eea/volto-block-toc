/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Menu, Sticky } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from '@eeacms/volto-block-toc/AnchorLink';
// import { StickyContainer, Sticky } from 'react-sticky';

const RenderMenuItems = ({ items }) => {
  // console.log('items', items);
  return map(items, (item) => {
    const { id, level, title } = item;
    console.log('id, level, items', id, level, title);
    return (
      item && (
        <React.Fragment key={id}>
          <Menu.Item className={`headline-${level}`}>
            <AnchorLink href={`#${id}`}>{title}</AnchorLink>
          </Menu.Item>
          {item.items?.length > 0 && <RenderMenuItems items={item.items} />}
        </React.Fragment>
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
  console.log('toc entries', tocEntries);
  const stickyRef = useRef(null);
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
      <Sticky
        onUnstick={(e) => console.log('HERE', e)}
        ref={stickyRef}
        offset={40}
      >
        <Menu>
          <RenderMenuItems items={tocEntries} />
        </Menu>
      </Sticky>
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
