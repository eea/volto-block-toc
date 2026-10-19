import TocView from './Block/TocView';
import TocEdit from './Block/TocEdit';
import variations from './Block/variations';

const applyConfig = (config) => {
  config.blocks.blocksConfig.toc = {
    ...config.blocks.blocksConfig.toc,
    sidebarTab: 1,
    view: TocView,
    edit: TocEdit,
    variations,
  };

  return config;
};

export default applyConfig;
