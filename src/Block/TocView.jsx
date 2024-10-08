/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import { Message } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import {
  withBlockExtensions,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';

export const getBlocksTocEntries = (properties, tocData) => {
  const blocksFieldName = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

  const blocks = properties[blocksFieldName];
  const blocks_layout = properties[blocksLayoutFieldname];

  const levels =
    tocData.levels?.length > 0
      ? tocData.levels.map((l) => parseInt(l.slice(1)))
      : [1, 2, 3, 4, 5, 6];
  let rootLevel = Infinity;
  let blocksFormEntries = [];
  let tocEntries = {};
  let tocEntriesLayout = [];

  blocks_layout.items.forEach((id) => {
    const block = blocks[id];
    const blockConfig = config.blocks.blocksConfig[block['@type']];

    if (!block || !blockConfig) {
      return null;
    }
    if (!blockConfig.tocEntries && !blockConfig.tocEntry) {
      return null;
    }

    const blockTocEntry = blockConfig.tocEntry?.(block, tocData);

    const blockTocEntries = [
      ...(blockConfig.tocEntries?.(block, tocData) ||
        (blockTocEntry ? [blockTocEntry] : [])),
    ];

    blocksFormEntries = [...blocksFormEntries, ...blockTocEntries];

    blockTocEntries.forEach((entry, index) => {
      const i = `${id}-${index}`;
      const level = entry[0];
      const title = entry[1];
      const items = [];
      if (!title?.trim()) return;
      if (!level || !levels.includes(level)) return;
      tocEntriesLayout.push(i);
      tocEntries[i] = {
        level,
        title: title || block.plaintext,
        items,
        id: i,
        override_toc: block.override_toc,
        plaintext: block.plaintext,
      };
      if (level < rootLevel) {
        rootLevel = level;
      }
    });
  });

  return {
    rootLevel,
    blocksFormEntries,
    tocEntries,
    tocEntriesLayout,
  };
};

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = (props) => {
  const { data, variation } = props;
  const metadata = props.metadata || props.properties;

  const tocEntries = React.useMemo(() => {
    let entries = [];
    let prevEntry = {};

    const { rootLevel, tocEntries, tocEntriesLayout } = getBlocksTocEntries(
      metadata,
      data,
    );

    tocEntriesLayout.forEach((id) => {
      const entry = tocEntries[id];
      if (entry.level === rootLevel) {
        entries.push(entry);
        prevEntry = entry;
        return;
      }
      if (!prevEntry.id) return;
      if (entry.level > prevEntry.level) {
        entry.parentId = prevEntry.id;
        prevEntry.items.push(entry);
        prevEntry = entry;
      } else if (entry.level < prevEntry.level) {
        let parent = tocEntries[prevEntry.parentId];
        while (entry.level <= parent.level) {
          parent = tocEntries[parent.parentId];
        }
        entry.parentId = parent.id;
        parent.items.push(entry);
        prevEntry = entry;
      } else {
        entry.parentId = prevEntry.parentId;
        tocEntries[prevEntry.parentId].items.push(entry);
        prevEntry = entry;
      }
    });

    return entries;
  }, [data, metadata]);

  const Renderer = variation?.view;

  return (
    <div className={cx('table-of-contents', variation?.id, props.device)}>
      {props.mode === 'edit' && !data.title && !tocEntries.length && (
        <Message>Table of content</Message>
      )}

      {Renderer ? (
        <Renderer {...props} tocEntries={tocEntries} properties={metadata} />
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

export default injectIntl(withBlockExtensions(withDeviceSize(View)));
