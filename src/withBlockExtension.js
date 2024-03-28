/**
 * A HOC to inject a block extension by resolving the configured extension
 */

import React from 'react';
import config from '@plone/volto/registry';

const withBlockExtensions = (WrappedComponent) => (props) => {
  const { data } = props;
  const { block_extension } = data;
  const type = data['@type'];
  const extensions = config.blocks.blocksConfig[type].extensions || [];

  const index = extensions.findIndex(
    (conf) => conf.id === (block_extension || 'default'),
  );

  if (index === -1) {
    throw new Error(
      `You need to register the default extension for block types: ${type}`,
    );
  }

  const selectedExtension = extensions[index];

  return (
    <WrappedComponent
      {...props}
      extension={selectedExtension}
      extensions={extensions}
    />
  );
};

export default withBlockExtensions;
