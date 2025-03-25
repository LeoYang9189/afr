"use client";

import { Menu } from '@arco-design/web-react';
import { IconFile } from '@arco-design/web-react/icon';
import { useRouter, usePathname } from 'next/navigation';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  return (
    <Menu
      style={{ width: '100%' }}
      defaultOpenKeys={['customs']}
      selectedKeys={[pathname]}
      onClickMenuItem={handleMenuClick}
    >
      <SubMenu
        key="customs"
        title={
          <span className="text-[14px]">
            <IconFile /> 海关管理
          </span>
        }
      >
        <MenuItem key="/customs/ics2">ICS2 申报</MenuItem>
        <MenuItem key="/customs/afr">AFR 申报</MenuItem>
      </SubMenu>
    </Menu>
  );
} 