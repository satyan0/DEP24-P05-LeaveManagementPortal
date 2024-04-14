import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import IITROPARLOGO from "../../img/logo.jpeg";

const Nav = styled.div`
  background: linear-gradient(135deg, #08328b, #265acb);
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: linear-gradient(135deg, #08328b, #08328b);
  width: 270px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: "0";
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const { currentUser, logout, refresh_user } = useAuth();
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={`bg-gradient-to-br from-gray-800 to-gray-900 ${
          true ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
      >
        <div className={`relative`}>
          <SidebarWrap>
            {SidebarData.map((item, index) => {
              if (!currentUser && item.title == "Logout") {
                return <></>;
              }
              if (currentUser && item.title == "Login") {
                return <></>;
              // } else if (item.title == "Logout") {
              //   return (
              //     <SubMenu
              //       item={item}
              //       key={index}
              //       showSidebar={showSidebar}
              //       currentUser={currentUser}
              //     />
              //   );
              } else {
                return (
                  <SubMenu
                    item={item}
                    key={index}
                    showSidebar={showSidebar}
                    currentUser={currentUser}
                  />
                );
              }
            })}
          </SidebarWrap>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
