/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
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
  const levels =
    data.levels?.length > 0
      ? data.levels.map((l) => parseInt(l.slice(1)))
      : [1, 2, 3, 4, 5, 6];
  const tocEntries = map(properties[blocksLayoutFieldname].items, (id) => {
    const block = properties[blocksFieldname][id];
    if (!blocks.blocksConfig[block['@type']]?.tocEntry) return null;
    const entry = blocks.blocksConfig[block['@type']]?.tocEntry(block, data);
    return entry ? [...entry, id] : null;
  }).filter((e) => !!e && levels.includes(e[0]));

  const Renderer = extension?.view;

  return (
    <div className={cx('table-of-contents', extension.id)}>
      {Renderer ? (
        <Renderer {...props} tocEntries={tocEntries} properties={properties} />
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
