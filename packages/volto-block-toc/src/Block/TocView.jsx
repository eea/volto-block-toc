/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import cx from 'classnames';
import { Message } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { withBlockExtensions } from '@plone/volto/helpers//Extensions';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers/Blocks/Blocks';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';

export const getBlocksTocEntries = (properties, tocData, tocContext = {}) => {
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

    // Expose the runtime context (e.g. visibility of conditional blocks) and
    // the block id to the tocEntry/tocEntries hooks, so blocks whose entries
    // depend on runtime data (like the conditional data block) can opt out.
    const blockContext = { ...tocContext, id };
    const blockTocEntry = blockConfig.tocEntry?.(block, tocData, blockContext);

    const blockTocEntries = [
      ...(blockConfig.tocEntries?.(block, tocData, blockContext) ||
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
const EMPTY_CONTEXT = {};

const View = (props) => {
  const { data, variation } = props;
  const metadata = props.metadata || props.properties;

  // Optional add-on provided selector that exposes runtime state (for example
  // the visibility of conditional data blocks) to the tocEntry/tocEntries
  // hooks. Configure it through `config.settings.toc.contextSelector`.
  const contextSelector = config.settings.toc?.contextSelector;
  const selectedContext = useSelector(
    (state) => (contextSelector ? contextSelector(state) : EMPTY_CONTEXT),
    shallowEqual,
  );
  const tocContext = selectedContext || EMPTY_CONTEXT;

  const tocEntries = React.useMemo(() => {
    let entries = [];
    let prevEntry = {};

    const { rootLevel, tocEntries, tocEntriesLayout } = getBlocksTocEntries(
      metadata,
      data,
      { ...tocContext, contentUid: metadata?.UID || metadata?.['@id'] },
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
  }, [data, metadata, tocContext]);

  const Renderer = variation?.view;
  const isEmpty = !tocEntries.length;

  return (
    <div
      className={cx('table-of-contents', variation?.id, props.device, {
        'empty-toc': isEmpty,
      })}
    >
      {props.mode === 'edit' && isEmpty ? (
        <Message className="toc-placeholder">
          {data.title && !data.hide_title ? <h2>{data.title}</h2> : null}
          <FormattedMessage
            id="The table of contents is empty. Add headings to the page or adjust the selected entry levels."
            defaultMessage="The table of contents is empty. Add headings to the page or adjust the selected entry levels."
          />
        </Message>
      ) : Renderer ? (
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
