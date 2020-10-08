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

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = ({ properties, data, tocEntries }) => {
  return (
    <>
      {data.title ? (
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
      <List bulleted>
        {map(
          tocEntries,
          ([level, entry, id]) =>
            entry && (
              <List.Item key={id} className={`headline-${level}`}>
                <AnchorLink href={`#${id}`}>{entry}</AnchorLink>
              </List.Item>
            ),
        )}
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
