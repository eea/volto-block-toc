import AccordionMenu from './AccordionMenu';
import DefaultTocRenderer from './DefaultTocRenderer';
import HorizontalMenu from './HorizontalMenu';
import SideMenu from './SideMenu';

const ToCVariations = [
  {
    id: 'default',
    title: 'Listing (default)',
    view: DefaultTocRenderer,
    isDefault: true,
  },
  {
    id: 'horizontalMenu',
    title: 'Horizontal Menu',
    view: HorizontalMenu,
  },
  {
    id: 'accordionMenu',
    title: 'Accordion Menu',
    view: AccordionMenu,
  },
  {
    id: 'eea-side-menu',
    title: 'Side Menu',
    view: SideMenu,
  },
];

export default ToCVariations;
