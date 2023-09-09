import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';
import { useAppContext } from '@/context/appContext';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';
import history from '@/utils/history';
import { UpOutlined, SettingOutlined, CustomerServiceOutlined, FileTextOutlined, FileSyncOutlined, DashboardOutlined, TeamOutlined, UserOutlined, CreditCardOutlined, MenuOutlined } from '@ant-design/icons';

const SIDEBAR_MENU = [
  { key: '/', icon: <DashboardOutlined />, title: 'Dashboard' },
  { key: '/customer', icon: <CustomerServiceOutlined />, title: 'Customer' },
  { key: '/invoice', icon: <FileTextOutlined />, title: 'Invoice' },
  { key: '/quote', icon: <FileSyncOutlined />, title: 'Quote' },
  { key: '/payment/invoice', icon: <CreditCardOutlined />, title: 'Payment Invoice' },
  { key: '/employee', icon: <UserOutlined />, title: 'Employee' },
  { key: '/admin', icon: <TeamOutlined />, title: 'Admin' },
];

const SETTINGS_SUBMENU = [
  { key: '/settings', title: 'General Settings' },
  { key: '/payment/mode', title: 'Payment Mode' },
  { key: '/role', title: 'Role' },
];

const { Sider } = Layout;
const { SubMenu } = Menu;

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="scroll-to-top-button"
      style={{ position: 'fixed', bottom: '20px', right: '5px', cursor: 'pointer' }}
      onClick={scrollToTop}
    >
      <Button type="primary" shape="circle" icon={<UpOutlined />} />
    </div>
  );
}

export default function Navigation() {
  return (
    <>
      <div className="sidebar-wraper">
        <Sidebar collapsible={true} />
      </div>
      <MobileSidebar />
    </>
  );
}

function Sidebar({ collapsible }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location) if (currentPath !== location.pathname) setCurrentPath(location.pathname);
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <>
      <Sider
        collapsible={collapsible}
        collapsed={collapsible ? isNavMenuClose : collapsible}
        onCollapse={onCollapse}
        className="navigation"
      >
        <div className="logo" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
          <img src={logoIcon} alt="Logo" style={{ height: '32px' }} />

          {!showLogoApp && (
            <img
              src={logoText}
              alt="Logo"
              style={{ marginTop: '3px', marginLeft: '10px', height: '29px' }}
            />
          )}
        </div>
        <Menu mode="inline" selectedKeys={[currentPath]}>
          {SIDEBAR_MENU.map((menuItem) => (
            <Menu.Item key={menuItem.key} icon={menuItem.icon}>
              <Link to={menuItem.key} />
              {menuItem.title}
            </Menu.Item>
          ))}
          <SubMenu key={'Settings'} icon={<SettingOutlined />} title={'Settings'}>
            {SETTINGS_SUBMENU.map((menuItem) => (
              <Menu.Item key={menuItem.key}>
                <Link to={menuItem.key} />
                {menuItem.title}
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      </Sider>
    </>
  );
}

function MobileSidebar() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Add an event listener to the window's scroll event
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle scroll event
  const handleScroll = () => {
    // If the user has scrolled down at least 100 pixels, show the button
    if (window.scrollY >= 70) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };
  
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      {/* Render ScrollToTopButton here */}
      {showScrollButton && <ScrollToTopButton />}
      <Button type="text" size="large" onClick={showDrawer} className="mobile-sidebar-btn">
        <MenuOutlined />
      </Button>
      <Drawer
        width={200}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="mobile-sidebar-wraper"
      >
        <Sidebar collapsible={false} />
      </Drawer>
    </>
  );
}