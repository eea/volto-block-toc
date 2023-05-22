import TocView from './Block/TocView';
import TocEdit from './Block/TocEdit';
import DefaultTocRenderer from './Block/DefaultTocRenderer';
import HorizontalMenu from './Block/HorizontalMenu';

const applyConfig = (config) => {
  config.blocks.blocksConfig.toc = {
    ...config.blocks.blocksConfig.toc,
    sidebarTab: 1,
    view: TocView,
    edit: TocEdit,
    extensions: [
      {
        id: 'default',
        title: 'Listing (default)',
        view: DefaultTocRenderer,
        schemaExtender: null,
      },
      {
        id: 'horizontalMenu',
        title: 'Horizontal Menu',
        view: HorizontalMenu,
        schemaExtender: null,
      },
    ],
  };

  return config;
};

export default applyConfig;
