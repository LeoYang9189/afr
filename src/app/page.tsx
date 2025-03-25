"use client";

import { Layout } from '@arco-design/web-react';
import SideMenu from '@/components/SideMenu';

const { Sider, Content } = Layout;

export default function Home() {
  return (
    <Layout className="h-screen">
      <Sider width={200} className="bg-[#f7f8fa]">
        <SideMenu />
      </Sider>
      <Content className="p-6 bg-white">
        <div className="min-h-full bg-white rounded-lg p-5">
          {/* 内容区域将在这里渲染 */}
        </div>
      </Content>
    </Layout>
  );
}
