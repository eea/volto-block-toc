import React from 'react';
import { SelectWidget } from '@plone/volto/components';
import config from '@plone/volto/registry';

const BlockExtensionWidget = (props) => {
  // get the block data from monkey-patched blockProps in getSchema()
  const { blockProps } = props;
  const type = blockProps.data['@type'];
  const extensions = config.blocks.blocksConfig[type].extensions || [];

  return (
    <SelectWidget
      {...props}
      choices={extensions.map(({ id, title }) => {
        return [id, title];
      })}
    />
  );
};

export default BlockExtensionWidget;
