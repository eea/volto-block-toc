/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { List } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const RenderListItems = ({ items }) => {
  return map(items, (item) => {
    const { id, level, title } = item;
    return (
      item && (
        <List.Item key={id} className={`headline-${level}`}>
          <AnchorLink href={`#${id}`}>{title}</AnchorLink>
          {item.items?.length > 0 && (
            <List.List role="list">
              <RenderListItems items={item.items} />
            </List.List>
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
      <List ordered={data.ordered} bulleted={!data.ordered}>
        <RenderListItems items={tocEntries} />
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
