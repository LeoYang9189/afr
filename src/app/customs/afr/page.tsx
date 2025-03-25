"use client";

import { Card, Input, Button, Table, Space, Select, Divider, Switch, DatePicker, Checkbox, Tag, Dropdown, Menu } from '@arco-design/web-react';
import { IconDown, IconUp, IconSettings, IconExclamation, IconMore } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [expanded, setExpanded] = useState(false);

  // 定义枚举值
  const customsStatusOptions = [
    { label: '全部', value: 'ALL' },
    { label: '原始等待回执', value: 'ORIGINAL_WAITING' },
    { label: '原始发送成功', value: 'ORIGINAL_SUCCESS' },
    { label: '原始发送失败', value: 'ORIGINAL_FAILED' },
    { label: '修改等待回执', value: 'MODIFY_WAITING' },
    { label: '修改成功', value: 'MODIFY_SUCCESS' },
    { label: '修改失败', value: 'MODIFY_FAILED' },
    { label: '删单等待回执', value: 'DELETE_WAITING' },
    { label: '删单成功', value: 'DELETE_SUCCESS' },
    { label: '删单失败', value: 'DELETE_FAILED' },
  ];

  const matchStatusOptions = [
    { label: 'MBL已匹配', value: 'MATCHED' },
    { label: 'MBL未匹配', value: 'UNMATCHED' },
  ];

  const riskWarningOptions = [
    { label: 'HOLD-布控', value: 'HOLD' },
    { label: '禁止装船', value: 'NO_LOADING' },
    { label: '禁止卸船', value: 'NO_UNLOADING' },
  ];

  return (
    <Card className="mb-4">
      <div className="flex items-center">
        <h1 className="page-title">AFR 申报</h1>
      </div>
      <Divider className="my-3" />
      <div className="search-form">
        <div className="search-form-content">
          <div className="search-form-row">
            <div className="search-form-item">
              <span className="label-text">MBL主单号：</span>
              <Input placeholder="请输入MBL主单号" allowClear />
            </div>
            <div className="search-form-item">
              <span className="label-text">HBL分单号：</span>
              <Input placeholder="请输入HBL分单号" allowClear />
            </div>
            <div className="search-form-item">
              <span className="label-text">箱号：</span>
              <Input placeholder="请输入箱号" allowClear />
            </div>
            <div className="search-form-item">
              <span className="label-text">提交状态：</span>
              <Select
                placeholder="请选择提交状态"
                allowClear
                defaultValue="ALL"
                options={[
                  { label: '全部', value: 'ALL' },
                  { label: '未提交', value: '未提交' },
                  { label: '已提交', value: '已提交' },
                ]}
              />
            </div>
          </div>
          {expanded && (
            <>
              <div className="search-form-row">
                <div className="search-form-item">
                  <span className="label-text">海关接收状态：</span>
                  <Select
                    placeholder="请选择海关接收状态"
                    allowClear
                    options={customsStatusOptions}
                  />
                </div>
                <div className="search-form-item">
                  <span className="label-text">匹配状态：</span>
                  <Select
                    placeholder="请选择匹配状态"
                    allowClear
                    options={matchStatusOptions}
                  />
                </div>
                <div className="search-form-item">
                  <span className="label-text">风险预警：</span>
                  <Select
                    placeholder="请选择风险预警"
                    allowClear
                    options={riskWarningOptions}
                  />
                </div>
                <div className="search-form-item">
                  <span className="label-text">船公司：</span>
                  <Input placeholder="请输入船公司" allowClear />
                </div>
              </div>
              <div className="search-form-row">
                <div className="search-form-item">
                  <span className="label-text">船名：</span>
                  <Input placeholder="请输入船名" allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">航次：</span>
                  <Input placeholder="请输入航次" allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">起运港：</span>
                  <Input placeholder="请输入起运港" allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">卸货港：</span>
                  <Input placeholder="请输入卸货港" allowClear />
                </div>
              </div>
              <div className="search-form-row">
                <div className="search-form-item">
                  <span className="label-text">目的港：</span>
                  <Input placeholder="请输入目的港" allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">创建人：</span>
                  <Input placeholder="请输入创建人" allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">创建时间：</span>
                  <DatePicker.RangePicker allowClear />
                </div>
                <div className="search-form-item">
                  <span className="label-text">最新编辑人：</span>
                  <Input placeholder="请输入最新编辑人" allowClear />
                </div>
              </div>
              <div className="search-form-row">
                <div className="search-form-item">
                  <span className="label-text">最新编辑时间：</span>
                  <DatePicker.RangePicker allowClear />
                </div>
              </div>
            </>
          )}
          <div className="search-form-buttons">
            <Space size="large">
              <Button type="primary">查询</Button>
              <Button>重置</Button>
              <Button
                type="text"
                onClick={() => setExpanded(!expanded)}
                icon={expanded ? <IconUp /> : <IconDown />}
              >
                {expanded ? '收起' : '展开'}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ActionBar = () => {
  const router = useRouter();

  // 跳转到新增页面
  const handleAdd = () => {
    router.push('/customs/afr/edit');
  };

  return (
    <div className="px-6 pb-6 flex items-center">
      <div className="flex-1 flex justify-between items-center">
        <Space size="large">
          <Button type="primary" size="large" onClick={handleAdd}>
            新建AFR
          </Button>
          <Button size="large">模板导入</Button>
        </Space>
        <Space size="large" className="ml-24">
          <Button type="text" icon={<IconSettings />}>
            自定义表格
          </Button>
          <Space size="small">
            <span className="text-[#4E5969]">只看自己</span>
            <Switch size="small" />
          </Space>
        </Space>
      </div>
    </div>
  );
};

const getStatusTag = (status: string) => {
  const colorMap: Record<string, string> = {
    '通过': 'green',
    '未通过': 'red',
  };
  return <Tag color={colorMap[status]}>{status}</Tag>;
};

const getCustomsStatusTag = (status: string) => {
  const colorMap: Record<string, { color: string, label: string }> = {
    'ORIGINAL_WAITING': { color: 'orange', label: '原始等待回执' },
    'ORIGINAL_SUCCESS': { color: 'green', label: '原始发送成功' },
    'ORIGINAL_FAILED': { color: 'red', label: '原始发送失败' },
    'MODIFY_WAITING': { color: 'orange', label: '修改等待回执' },
    'MODIFY_SUCCESS': { color: 'green', label: '修改成功' },
    'MODIFY_FAILED': { color: 'red', label: '修改失败' },
    'DELETE_WAITING': { color: 'orange', label: '删单等待回执' },
    'DELETE_SUCCESS': { color: 'green', label: '删单成功' },
    'DELETE_FAILED': { color: 'red', label: '删单失败' },
  };
  const config = colorMap[status] || { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
};

const getDraftStatusDot = (status: string) => {
  const color = status === '通过' ? '#00B42A' : '#F53F3F';
  return (
    <Space>
      <div 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: color,
          display: 'inline-block',
          marginRight: '4px'
        }} 
      />
      <span>{status}</span>
    </Space>
  );
};

const getSubmitStatusDot = (status: string) => {
  const color = status === '已提交' ? '#00B42A' : '#FF7D00';
  return (
    <Space>
      <div 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: color,
          display: 'inline-block',
          marginRight: '4px'
        }} 
      />
      <span>{status}</span>
    </Space>
  );
};

const getMatchStatusTag = (status: string) => {
  const colorMap: Record<string, { color: string, label: string }> = {
    '已匹配': { color: 'green', label: 'MBL已匹配' },
    '未匹配': { color: 'gray', label: 'MBL未匹配' },
  };
  const config = colorMap[status] || { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
};

const getRiskWarning = (warning: string) => {
  if (warning === '无风险') return null;
  return (
    <Space size={4}>
      <div 
        style={{ 
          width: '16px', 
          height: '16px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(245, 63, 63, 0.1)', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <IconExclamation style={{ color: '#F53F3F', fontSize: '12px' }} />
      </div>
      <span style={{ color: '#F53F3F', whiteSpace: 'nowrap' }}>{warning}</span>
    </Space>
  );
};

const AfrPage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    total: 100,
    pageSize: 10,
    current: 1,
  });

  // 添加港口代码与全称的映射
  const portMapping: Record<string, string> = {
    'CNSHA': 'Shanghai, China',
    'CNNGB': 'Ningbo, China',
    'CNTAO': 'Qingdao, China',
    'USLAX': 'Los Angeles, USA',
    'USNYC': 'New York, USA',
    'USOAK': 'Oakland, USA',
    'DEHAM': 'Hamburg, Germany',
    'NLRTM': 'Rotterdam, Netherlands',
    'GBFXT': 'Felixstowe, UK'
  };

  // 添加通用的单元格渲染函数
  const renderCell = (value: any) => {
    return <span className="whitespace-nowrap">{value}</span>;
  };

  const renderPort = (code: string) => {
    return (
      <span className="whitespace-nowrap">
        {code} | {portMapping[code] || code}
      </span>
    );
  };

  const handlePageChange = (current: number) => {
    setPagination({ ...pagination, current });
  };

  const columns = [
    {
      title: '',
      dataIndex: 'selection',
      width: 40,
      render: () => <Checkbox />,
    },
    {
      title: 'NVOCC Code',
      dataIndex: 'nvocc',
      width: 120,
      resizable: true,
      render: renderCell,
    },
    {
      title: 'HBL分单号',
      dataIndex: 'hbl',
      width: 150,
      resizable: true,
      render: renderCell,
    },
    {
      title: 'MBL主单号',
      dataIndex: 'mbl',
      width: 150,
      resizable: true,
      render: renderCell,
    },
    {
      title: '船公司',
      dataIndex: 'carrier',
      width: 120,
      resizable: true,
      render: renderCell,
    },
    {
      title: '草稿校验状态',
      dataIndex: 'draftStatus',
      width: 120,
      resizable: true,
      render: getDraftStatusDot,
    },
    {
      title: '提交状态',
      dataIndex: 'submitStatus',
      width: 100,
      resizable: true,
      render: getSubmitStatusDot,
    },
    {
      title: '海关接收状态',
      dataIndex: 'customsStatus',
      width: 140,
      resizable: true,
      render: getCustomsStatusTag,
    },
    {
      title: '匹配状态',
      dataIndex: 'matchStatus',
      width: 120,
      resizable: true,
      render: getMatchStatusTag,
    },
    {
      title: '风险评估预警',
      dataIndex: 'riskWarning',
      width: 120,
      resizable: true,
      render: getRiskWarning,
    },
    {
      title: '船名',
      dataIndex: 'vesselName',
      width: 260,
      resizable: true,
      render: renderCell,
    },
    {
      title: '航次',
      dataIndex: 'voyage',
      width: 100,
      resizable: true,
      render: renderCell,
    },
    {
      title: '装货港',
      dataIndex: 'loadingPort',
      width: 280,
      resizable: true,
      render: renderPort,
    },
    {
      title: '卸货港',
      dataIndex: 'dischargePort',
      width: 280,
      resizable: true,
      render: renderPort,
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      width: 280,
      resizable: true,
      render: renderPort,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
      resizable: true,
      render: renderCell,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      resizable: true,
      render: renderCell,
    },
    {
      title: '最新编辑人',
      dataIndex: 'lastEditor',
      width: 100,
      resizable: true,
      render: renderCell,
    },
    {
      title: '最新编辑时间',
      dataIndex: 'lastEditTime',
      width: 200,
      resizable: true,
      render: renderCell,
    },
    {
      title: '自定义备注',
      dataIndex: 'remarks',
      width: 150,
      resizable: true,
      render: renderCell,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space className="whitespace-nowrap">
          <Button type="text">查看</Button>
          <Button 
            type="text" 
            onClick={() => router.push(`/customs/afr/edit?id=${record.id}`)}
          >
            编辑
          </Button>
          <Dropdown
            position="bottom"
            droplist={
              <Menu>
                <Menu.Item key="export">导出凭证</Menu.Item>
                <Menu.Item key="delete">发送删单</Menu.Item>
                <Menu.Item key="copy">复制数据</Menu.Item>
              </Menu>
            }
          >
            <Button type="text" icon={<IconMore />}>更多</Button>
          </Dropdown>
        </Space>
      ),
    }
  ];

  return (
    <div className="p-6">
      <Card className="mb-4">
        <SearchBar />
      </Card>
      <Card>
        <ActionBar />
        <Table
          className="pt-4 border-t border-[#E5E6EB]"
          columns={columns}
          data={Array(10).fill(null).map((_, index) => ({
            key: index,
            id: String(index + 1),
            nvocc: 'J76N',
            hbl: `HBL${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
            mbl: `MBL${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
            carrier: ['COSCO', 'MSC', 'MAERSK', 'CMA CGM', 'EVERGREEN'][Math.floor(Math.random() * 5)],
            draftStatus: ['通过', '未通过'][Math.floor(Math.random() * 2)],
            submitStatus: ['未提交', '已提交'][Math.floor(Math.random() * 2)],
            customsStatus: [
              'ORIGINAL_WAITING',
              'ORIGINAL_SUCCESS',
              'ORIGINAL_FAILED',
              'MODIFY_WAITING',
              'MODIFY_SUCCESS',
              'MODIFY_FAILED',
              'DELETE_WAITING',
              'DELETE_SUCCESS',
              'DELETE_FAILED',
            ][Math.floor(Math.random() * 9)],
            matchStatus: ['已匹配', '未匹配'][Math.floor(Math.random() * 2)],
            riskWarning: ['无风险', 'HOLD-Control', '禁止装载'][Math.floor(Math.random() * 3)],
            vesselName: ['EVER GIVEN', 'MSC OSCAR', 'CMA CGM MARCO POLO'][Math.floor(Math.random() * 3)],
            voyage: `V${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            loadingPort: ['CNSHA', 'CNNGB', 'CNTAO'][Math.floor(Math.random() * 3)],
            dischargePort: ['USLAX', 'USNYC', 'USOAK'][Math.floor(Math.random() * 3)],
            destinationPort: ['DEHAM', 'NLRTM', 'GBFXT'][Math.floor(Math.random() * 3)],
            creator: ['张三', '李四', '王五'][Math.floor(Math.random() * 3)],
            createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString(),
            lastEditor: ['张三', '李四', '王五'][Math.floor(Math.random() * 3)],
            lastEditTime: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toLocaleString(),
            remarks: ['紧急处理', '需要复核', '已确认'][Math.floor(Math.random() * 3)],
          }))}
          scroll={{ x: 'max-content' }}
          border={{ wrapper: true, cell: true }}
          stripe
          pagination={{
            total: 100,
            pageSize: 10,
            current: 1,
            onChange: handlePageChange,
          }}
          noDataElement="暂无数据"
          components={{
            header: {
              cell: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
                <th {...props} style={{ ...props.style, whiteSpace: 'nowrap' }} />
              ),
            },
            body: {
              cell: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
                <td {...props} style={{ ...props.style, whiteSpace: 'nowrap' }} />
              ),
            },
          }}
        />
      </Card>
    </div>
  );
};

export default AfrPage; 