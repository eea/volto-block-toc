import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import './less/side-menu.less';

const RenderMenuItems = ({ items }) => {
  return (
    <Accordion fluid styled>
      {items.map((item, index) => {
        const { title, override_toc, plaintext, items: subItems } = item;
        const slug = override_toc
          ? Slugger.slug(normalizeString(plaintext))
          : Slugger.slug(normalizeString(title));
        return (
          <React.Fragment key={index}>
            <div className="title">
              <AnchorLink href={`#${slug}`}>{title}</AnchorLink>
            </div>
            {subItems && subItems.length > 0 && (
              <RenderAccordionItems items={subItems} />
            )}
          </React.Fragment>
        );
      })}
    </Accordion>
  );
};

const View = (props) => {
  const { data, tocEntries, mode } = props;
  const [open, setOpen] = useState(true);
  const [rendered, setRendered] = useState(false);

  const offset = 120; // minimum distance from fotter

  useEffect(() => {
    const sideMenu = document.querySelector('.tocSideMenu');
    const footer = document.querySelector('footer');

    if (props.device === 'mobile') {
      sideMenu.style.position = '';
      sideMenu.style.right = '';
      sideMenu.style.top = '';
      return;
    }
    if (mode === 'edit') return;

    if (!rendered) {
      setRendered(true);
      return;
    }

    function adjustSideMenuPosition() {
      const footerRect = footer.getBoundingClientRect();
      const sideMenuRect = sideMenu?.getBoundingClientRect();
      const pageDocumentRect = document
        .getElementById('page-document')
        .getBoundingClientRect();
      sideMenu.style.position = 'absolute';
      sideMenu.style.right = 100 + 'px';
      sideMenu.style.top =
        Math.max(
          window.scrollY + pageDocumentRect.top - 20,
          window.scrollY + 20,
        ) + 'px';

      const distanceToFooter =
        footerRect.top - sideMenu?.getBoundingClientRect().bottom;

      //menu is too close from footer
      if (distanceToFooter <= offset) {
        const newTop = Math.max(
          window.scrollY + pageDocumentRect.top - 50,
          window.scrollY + footerRect.top - sideMenuRect.height - offset,
        );
        sideMenu.style.position = 'absolute';
        sideMenu.style.top = `${newTop}px`;
      } else {
        //calculate position based on the scroll and start of the page
        sideMenu.style.top =
          Math.max(
            window.scrollY + pageDocumentRect.top - 20,
            window.scrollY + 20,
          ) + 'px';
      }
    }

    window.addEventListener('scroll', adjustSideMenuPosition);
    adjustSideMenuPosition();

    return () => {
      window.removeEventListener('scroll', adjustSideMenuPosition);
    };
  }, [rendered, mode, open, data.variation, props.device]);

  if (tocEntries?.length > 0)
    return (
      <Accordion fluid styled>
        <React.Fragment index={0}>
          <Accordion.Title
            active={open}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Icon
              name={open ? 'angle up' : 'angle right'}
              className="menuTitle"
            />

            <p className="menuTitle">{data?.title || ''}</p>
          </Accordion.Title>
          <Accordion.Content active={open}>
            <RenderMenuItems items={tocEntries} />
          </Accordion.Content>
        </React.Fragment>
      </Accordion>
    );
  else return <></>;
};

View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(View);
