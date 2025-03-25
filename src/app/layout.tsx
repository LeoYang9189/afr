"use client";

import '@arco-design/web-react/dist/css/arco.css';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@arco-design/web-react';
import SideMenu from '@/components/SideMenu';

const { Sider, Content } = Layout;
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Layout className="h-screen">
          <Sider width={200} className="bg-[#f7f8fa]">
            <SideMenu />
          </Sider>
          <Content className="p-6 bg-white">
            <div className="min-h-full bg-white rounded-lg p-5">
              {children}
            </div>
          </Content>
        </Layout>
      </body>
    </html>
  );
}
