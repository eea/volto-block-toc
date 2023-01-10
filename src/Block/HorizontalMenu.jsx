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

const RenderMenuItems = ({ items }) => {
  return map(items, (item) => {
    const { id, level, title } = item;
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
        context={__CLIENT__ && document.getElementById('page-document')}
        ref={stickyRef}
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
