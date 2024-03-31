import React, { useEffect } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faChartPie, faCog, faSignOutAlt, faTable, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Dropdown, Accordion } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { useChat } from "../api/context";
import { Routes } from "../routes";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const location = useLocation();
  const { pathname } = location;
  const {userData, setUserData} = useChat();
  
  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";
    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /></span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  //prevent the state fom losing when refreshing the page
  useEffect(() => {
    if(userData.Username !== ""){
      window.localStorage.setItem('data',JSON.stringify(userData));
    }
  },[]);

  useEffect(() => {
    if(typeof(window.localStorage.getItem('data')) !=="undefined"){
      setUserData(JSON.parse(window.localStorage.getItem('data')))
    }
  }, []);
  

  const NavItem = (props) => {
    const { title, tag, permission, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : ""; //add a small icon like pro to an element of sidebar
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} >
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}
            {tag === "tag"?<span className="sidebar-text">您好 ! {title} / {permission === 1    ? "Super User" : "Normal User"}</span>
            :
            <span className="sidebar-text">{title}</span>
            }
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <CSSTransition timeout={300}  classNames="sidebar-transition">
      <SimpleBar className={`collapse show sidebar d-md-block bg-primary text-white`}>
        {/* px : distance to the left, pt : distance to the top */}
        <div className="sidebar-inner px-4 pt-3"> 
          <Nav className="flex-column pt-3 pt-md-0">
            {/* <NavItem title={userData.Username} permission = {userData.Permission} tag="tag"  /> */}
            <NavItem title="首頁" link={Routes.DashboardOverview.path} icon={faChartPie} />
            <NavItem title="財會系統" icon={faHandHoldingUsd} link={Routes.Transactions.path} />
            {/* <CollapsableNavItem eventKey="examples/" title="進銷存" icon={faBoxOpen}> */}
              {/* <NavItem title="進貨" link={Routes.Purchase.path} />
              <NavItem title="銷貨" link={Routes.Sales.path} /> */}
            {/* </CollapsableNavItem> */}
            <CollapsableNavItem eventKey="examples/" title="基礎設定" icon={faCog}>
              <NavItem title="會科設定" link={Routes.Accountingsettings.path} />
              <NavItem title="原物料期初庫存設定" link={Routes.BeginningInventorysettings.path} />
              <NavItem title="價值標的設定" link={Routes.Valuetargets.path} />
              <NavItem title="供應商基本資料設定" link={Routes.Supplierssettings.path}  />
              <NavItem title="BOM 設定" link={Routes.Bomsettings.path} />
              <NavItem title="單位轉換表(pending)" link={Routes.Settings.path} />
            </CollapsableNavItem>            
            <CollapsableNavItem eventKey="tables/" title="管理報表" icon={faTable}>
              <NavItem title="進銷存管理報表" link={Routes.Inventory.path} />
              <NavItem title="損益表" link={Routes.IncomeStatement.path} />
            </CollapsableNavItem>
            {/* <CollapsableNavItem eventKey="tables/" title="使用者權限設定" icon={faBook}>
              <NavItem title="使用者權限設定" link={Routes.Settings.path} />
              <NavItem title="報表權限設定" link={Routes.Settings.path} />
            </CollapsableNavItem>
            <NavItem title="編輯個人資料" icon={faHandHoldingUsd} link={Routes.ChangeProfile.path} /> */}
            <NavItem title="登出" link={Routes.Presentation.path} icon={faSignOutAlt} />
            <Dropdown.Divider className="my-3 border-indigo" />


            
          </Nav>
        </div>
      </SimpleBar>
    </CSSTransition>
  );
};
