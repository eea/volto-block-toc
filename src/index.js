import TocView from './Block/TocView';
import TocEdit from './Block/Edit';
import DefaultTocRenderer from './Block/DefaultTocRenderer';
import MultiSelectWidget from './Widgets/MultiSelectWidget';
import BlockExtensionWidget from './Widgets/BlockExtensionWidget';
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

  config.widgets.widget.toc_multi_select_widget = MultiSelectWidget;
  config.widgets.widget.block_extension = BlockExtensionWidget;

  return config;
};

export default applyConfig;
