import React, { memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Accordion, useAccordionButton } from 'react-bootstrap';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const VerticalNav = memo(() => {
  const location = useLocation();
  const adminType = localStorage.getItem('adminType');

  // Define the menu items based on admin type
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
    {
      path: '/admin', name: 'Admin', icon: <AdminPanelSettingsIcon />
    },
    {
      path: '/client-admin', name: 'Client Admin', icon: <PeopleIcon />
    },
    {
      path: '/dashboard/Attendance', name: 'Attendance', icon: <EventAvailableIcon />
    },
    {
      path: '/user', name: 'User', icon: <GroupAddIcon />
    },
    {
      path: '/employee', name: 'Employee', icon: <BadgeIcon />
    },
    {
      path: '/offer-email', name: 'offer Email', icon: <ForwardToInboxIcon />
    },
    {
      path: '/dashboard/lead-list', name: 'Lead Details', icon: <NoteAddIcon />
    },
    {
      path: '/dashboard/sales-list',
      name: 'Total Sales',
      icon: <AddCardIcon />,
    },
    {
      path: '/dashboard/create-invoice',
      name: 'Generate Invoice',
      icon: <ReceiptIcon />,
    },
    {
      path: '/dashboard/expense',
      name: 'Expense',
      icon: <CreditCardIcon />,
    },
    {
      name: 'Diet',
      icon: <LocalDiningIcon />,
      subMenu: [
        { path: 'dashboard/food-list', name: 'Food', icon: <FastfoodIcon /> },
        { path: '/dashboard/diet-list', name: 'Diet-List', icon: <DateRangeIcon /> },
      ],
    },
    {
      path: 'dashboard/exercise-list', name: 'Exercise Plan', icon: <FastfoodIcon />
    },
    {
      path: '/auth/logout',
      name: 'Logout',
      icon: (
        <svg
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M2 6.447C2 3.996 4.03024 2 6.52453 2H11.4856C13.9748 2 16 3.99 16 6.437V17.553C16 20.005 13.9698 22 11.4744 22H6.51537C4.02515 22 2 20.01 2 17.563V16.623V6.447Z"
            fill="currentColor"
          ></path>
          <path
            d="M21.7787 11.4548L18.9329 8.5458C18.6388 8.2458 18.1655 8.2458 17.8723 8.5478C17.5802 8.8498 17.5811 9.3368 17.8743 9.6368L19.4335 11.2298H17.9386H9.54826C9.13434 11.2298 8.79834 11.5748 8.79834 11.9998C8.79834 12.4258 9.13434 12.7698 9.54826 12.7698H19.4335L17.8743 14.3628C17.5811 14.6628 17.5802 15.1498 17.8723 15.4518C18.0194 15.6028 18.2113 15.6788 18.4041 15.6788C18.595 15.6788 18.7868 15.6028 18.9329 15.4538L21.7787 12.5458C21.9199 12.4008 21.9998 12.2048 21.9998 11.9998C21.9998 11.7958 21.9199 11.5998 21.7787 11.4548Z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
  ];

  // Filter menu items based on admin type
  const filteredMenuItems = menuItems.filter((menuItem) => {
    if (adminType === 'MASTER') {
      return true;
    } else if (adminType === 'SUB') {
      return menuItem.name !== 'Client Admin' && menuItem.name !== 'Admin' && menuItem.name !== 'Employee' && menuItem.name !== 'offer Email';
    }
    else if (adminType === 'CLIENT' || adminType === 'TRIAL') {
      return menuItem.name !== 'Client Admin';
    }
    return true;
  });

  const [activeMenu, setActiveMenu] = useState('');
  const [expandedSubMenus, setExpandedSubMenus] = useState({});

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveMenu(currentPath);
  }, [location.pathname]);

  const handleSubMenuClick = (path) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <span onClick={decoratedOnClick}>
        {children}
      </span>
    );
  }
  return (
    <div className='navbar-nav-container'>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {filteredMenuItems.map((menuItem, index) => (
          <li key={index} className={`nav-item ${activeMenu === menuItem.path ? 'active' : ''}`}>
            {menuItem.subMenu ? (
              <CustomToggle eventKey={index}>
                <Link
                  className={`nav-link dropdown-toggle ${activeMenu === menuItem.path ? 'active' : ''}`}
                  to={menuItem.path}
                  onClick={() => {
                    setActiveMenu(menuItem.path);
                    handleSubMenuClick(menuItem.path);
                  }}
                >
                  {menuItem.icon}
                  <span className="item-name">{menuItem.name}</span>
                </Link>
              </CustomToggle>
            ) : (
              <Link
                className={`nav-link ${activeMenu === menuItem.path ? 'active' : ''}`}
                to={menuItem.path}
                onClick={() => setActiveMenu(menuItem.path)}
              >
                {menuItem.icon}
                <span className="item-name">{menuItem.name}</span>
              </Link>
            )}

            {menuItem.subMenu && (
              <Accordion.Collapse eventKey={index} in={expandedSubMenus[menuItem.path]}>
                <ul className="iq-submenu">
                  {menuItem.subMenu.map((subMenuItem, subIndex) => (
                    <li
                      key={subIndex}
                      className={`nav-item ${activeMenu === subMenuItem.path ? 'active' : ''}`}
                    >
                      <Link
                        className={`nav-link ${activeMenu === subMenuItem.path ? 'active' : ''}`}
                        to={subMenuItem.path}
                        onClick={() => setActiveMenu(subMenuItem.path)}
                      >
                        {subMenuItem.icon}
                        <span className="item-name">{subMenuItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Collapse>
            )}
          </li>
        ))}
        <li>
          <hr className="hr-horizontal" />
        </li>
      </Accordion>
    </div>
  );
});

export default VerticalNav