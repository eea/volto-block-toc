/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { injectIntl } from 'react-intl';
import { blocks } from '~/config';
import withBlockExtension from '../withBlockExtension';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = (props) => {
  const { properties, data, extension } = props;
  const blocksFieldname = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);
  const tocEntries = map(properties[blocksLayoutFieldname].items, (id) => {
    const block = properties[blocksFieldname][id];
    return blocks.blocksConfig[block['@type']]?.tocEntry
      ? blocks.blocksConfig[block['@type']]?.tocEntry(block, data)
      : null;
  });

  const Renderer = extension?.view;

  return (
    <div className="block table-of-contents">
      {Renderer ? (
        <Renderer {...props} entries={tocEntries} properties={properties} />
      ) : (
        <div>View extension not found</div>
      )}
    </div>
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

export default injectIntl(withBlockExtension(View));
