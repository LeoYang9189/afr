"use client";

import { Card, Form, Input, Select, Space, Button, Checkbox, DatePicker, Tabs, Message, Modal, Table, Upload } from '@arco-design/web-react';
import { IconPlus, IconDown, IconUp, IconDelete, IconEdit } from '@arco-design/web-react/icon';
import styles from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense, useMemo } from 'react';
import type { SelectProps } from '@arco-design/web-react';
import { ColumnProps } from '@arco-design/web-react/es/Table/interface';

const FormItem = Form.Item;
const Option = Select.Option;

// HBL No. 前缀选项
const HBL_PREFIXES = ['J76N', 'J8N2'];

// 船公司选项
const CARRIERS = [
  { label: 'ASL | 亚海航运 | 42JQ', value: '42JQ' },
  { label: 'BAL | 博亚 | 43HX', value: '43HX' },
  { label: 'CCL | 新中通海运 | 13YG', value: '13YG' },
  { label: 'CJZU | 中日轮渡 | CJZU', value: 'CJZU' },
  { label: 'CKS | 天敏海运 | CKCO', value: 'CKCO' },
  { label: 'CMA | 达飞轮船 | 13VT', value: '13VT' },
  { label: 'CNC | 正利航运 | 42NY', value: '42NY' },
  { label: 'CUL | 中联航运 | 43FM', value: '43FM' },
  { label: 'DBR | 大连集发环渤海集装箱运输有限公司 | 42SA', value: '42SA' },
  { label: 'DJS | 东进商船公司 | DJSC', value: 'DJSC' },
  { label: 'EAS | 达通航运 | 42HT', value: '42HT' },
  { label: 'EMC | 长荣海运 | EGLV', value: 'EGLV' },
  { label: 'GSL | 金星轮船 | GOSU', value: 'GOSU' },
  { label: 'HAL | 兴亚 | HASL', value: 'HASL' },
  { label: 'HASCO | 海华 | 12GE', value: '12GE' },
  { label: 'TPH | 合德航运 | 42RS', value: '42RS' },
  { label: 'HMM | 现代商船 | HDMU', value: 'HDMU' },
  { label: 'HPL | 赫伯罗特 | HLCU', value: 'HLCU' },
  { label: 'IAL3 | 运达航运 | 12AT', value: '12AT' },
  { label: 'JINJIANG | 锦江 | 11WJ', value: '11WJ' },
  { label: 'JZS | 吉祥船务 | 13UQ', value: '13UQ' },
  { label: 'KKC | 神原汽船 | KKCL', value: 'KKCL' },
  { label: 'KMTC | 高丽海运 | KMTC', value: 'KMTC' },
  { label: 'SITC | 山东海丰 | 12PD', value: '12PD' },
  { label: 'MCC | 海陆马士基 | MCPU', value: 'MCPU' },
  { label: 'MSC | 地中海 | MEDU', value: 'MEDU' },
  { label: 'MSK | 马士基 | MAEU', value: 'MAEU' },
  { label: 'MSL | 上海民生轮船 | 13CQ', value: '13CQ' },
  { label: 'NUC | 宁波远洋运输 | 12LU', value: '12LU' },
  { label: 'NS | 南星海运 | NSSL', value: 'NSSL' },
  { label: 'ONE | 海洋网联 | ONEY', value: 'ONEY' },
  { label: 'OOCL | 东方海外 | OOLU', value: 'OOLU' },
  { label: 'PANASIA | 中远泛亚 | 13RH', value: '13RH' },
  { label: 'PCS | 泛洲海运 | PCLU', value: 'PCLU' },
  { label: 'SL | 海得纸 | SSTL', value: 'SSTL' },
  { label: 'SNKO | 长锦商船 | SNKO', value: 'SNKO' },
  { label: 'SINO | 中外运 | 12IH', value: '12IH' },
  { label: 'SSF | 下关轮渡 | 42CG', value: '42CG' },
  { label: 'TCLC | 太仓港集运 | 32GG', value: '32GG' },
  { label: 'TSL | 德翔航运 | 13DF', value: '13DF' },
  { label: 'WDISCO | 新港大通 | 43AJ', value: '43AJ' },
  { label: 'WHL | 万海航运 | 22AA', value: '22AA' },
  { label: 'YML | 阳明海运 | YMLU', value: 'YMLU' },
  { label: 'ZIM | 以星航运 | ZIMU', value: 'ZIMU' },
  { label: 'CY | 国商 | 43PD', value: '43PD' },
  { label: 'DYS | 东映 | PCSL', value: 'PCSL' },
  { label: 'DCL | 东辰航运 | 42UW', value: '42UW' },
  { label: 'HXC | 华信集运 | 43BZ', value: '43BZ' },
  { label: 'ONTO | 安通船务 | 31XE', value: '31XE' },
  { label: 'PES | 山港航运 | 43LW', value: '43LW' },
  { label: 'QPT | 山港航运通宝 | 42UE', value: '42UE' },
  { label: 'PANO | 泛洋 | POBU', value: 'POBU' },
  { label: 'SOE | 瑞洋海运 | 31VT', value: '31VT' },
  { label: 'NHS | 青岛泛扬 | 13YS', value: '13YS' },
  { label: 'SOF | 顺发 | 43LG', value: '43LG' }
] as const;

// 运输方式选项
const TRANSPORT_MODES = [
  { label: 'PortToPort-港到港运输', value: 'PortToPort' },
  { label: 'Inland Transit-内陆运输', value: 'InlandTransit' },
  { label: 'Transit Export-中转出口', value: 'TransitExport' },
  { label: 'Immediate Reexport-立即再出口', value: 'ImmediateReexport' }
];

// 港口选项类型
interface PortOption {
  label: string;
  value: string;
}

// 港口选项
const PORT_OPTIONS: PortOption[] = [
  { label: 'SHANGHAI | CNSHA | 上海', value: 'CNSHA' },
  { label: 'NINGBO | CNNGB | 宁波', value: 'CNNGB' },
  { label: 'QINGDAO | CNTAO | 青岛', value: 'CNTAO' },
  { label: 'TIANJIN | CNTNG | 天津', value: 'CNTNG' },
  { label: 'DALIAN | CNDLC | 大连', value: 'CNDLC' },
  { label: 'XIAMEN | CNXMN | 厦门', value: 'CNXMN' },
  { label: 'GUANGZHOU | CNCAN | 广州', value: 'CNCAN' },
  { label: 'SHENZHEN | CNSZX | 深圳', value: 'CNSZX' },
  { label: 'TOKYO | JPTYO | 东京', value: 'JPTYO' },
  { label: 'YOKOHAMA | JPYOK | 横滨', value: 'JPYOK' },
  { label: 'OSAKA | JPOSA | 大阪', value: 'JPOSA' },
  { label: 'KOBE | JPUKB | 神户', value: 'JPUKB' },
  { label: 'NAGOYA | JPNGO | 名古屋', value: 'JPNGO' },
  { label: 'MOJI | JPMOJ | 门司', value: 'JPMOJ' },
  { label: 'HAKATA | JPHKT | 博多', value: 'JPHKT' },
  { label: 'BUSAN | KRPUS | 釜山', value: 'KRPUS' },
  { label: 'INCHEON | KRINC | 仁川', value: 'KRINC' },
  { label: 'HONG KONG | HKHKG | 香港', value: 'HKHKG' },
  { label: 'KAOHSIUNG | TWKHH | 高雄', value: 'TWKHH' },
  { label: 'KEELUNG | TWKEL | 基隆', value: 'TWKEL' },
  { label: 'TAICHUNG | TWTXG | 台中', value: 'TWTXG' },
  { label: 'MANILA | PHMNL | 马尼拉', value: 'PHMNL' },
  { label: 'SINGAPORE | SGSIN | 新加坡', value: 'SGSIN' },
  { label: 'BANGKOK | THBKK | 曼谷', value: 'THBKK' },
  { label: 'LAEM CHABANG | THLCH | 林查班', value: 'THLCH' },
  { label: 'HO CHI MINH | VNSGN | 胡志明', value: 'VNSGN' },
  { label: 'HAIPHONG | VNHPH | 海防', value: 'VNHPH' },
  { label: 'JAKARTA | IDJKT | 雅加达', value: 'IDJKT' },
  { label: 'PORT KLANG | MYPKG | 巴生港', value: 'MYPKG' },
  { label: 'PENANG | MYPEN | 槟城', value: 'MYPEN' }
];

interface VesselOption {
  label: string;
  value: string;
}

// 船名选项（虚拟数据）
const VESSEL_OPTIONS: VesselOption[] = [
  { label: 'SITC HAIPHONG | 海丰海防 | 呼号:VRDS8 | IMO:9494591 | 巴拿马', value: 'SITC HAIPHONG' },
  { label: 'SITC HOCHIMINH | 海丰胡志明 | 呼号:3FVR8 | IMO:9494633 | 巴拿马', value: 'SITC HOCHIMINH' },
  { label: 'SITC HONGKONG | 海丰香港 | 呼号:VRCX6 | IMO:9494580 | 香港', value: 'SITC HONGKONG' },
  { label: 'SITC JAKARTA | 海丰雅加达 | 呼号:3FMV2 | IMO:9494608 | 巴拿马', value: 'SITC JAKARTA' },
  { label: 'SITC KAOHSIUNG | 海丰高雄 | 呼号:3ETV7 | IMO:9494610 | 巴拿马', value: 'SITC KAOHSIUNG' },
  { label: 'SITC MANILA | 海丰马尼拉 | 呼号:3FWX5 | IMO:9494622 | 巴拿马', value: 'SITC MANILA' },
  { label: 'SITC OSAKA | 海丰大阪 | 呼号:3FVT4 | IMO:9494645 | 巴拿马', value: 'SITC OSAKA' },
  { label: 'SITC SHANGHAI | 海丰上海 | 呼号:VRFK2 | IMO:9494567 | 香港', value: 'SITC SHANGHAI' },
  { label: 'SITC TOKYO | 海丰东京 | 呼号:3FVS6 | IMO:9494657 | 巴拿马', value: 'SITC TOKYO' },
  { label: 'OOCL BEIJING | 北京 | 呼号:VRMX8 | IMO:9776171 | 香港', value: 'OOCL BEIJING' },
  { label: 'OOCL GUANGZHOU | 广州 | 呼号:VRME8 | IMO:9776183 | 香港', value: 'OOCL GUANGZHOU' },
  { label: 'OOCL SHENZHEN | 深圳 | 呼号:VRMH7 | IMO:9776195 | 香港', value: 'OOCL SHENZHEN' }
];

// 为 Select.Option 的 props 定义类型
interface OptionProps {
  children: React.ReactNode;
  value: string;
}

// 为 Form 组件的 onChange 事件定义类型
interface FormChangeValues {
  [key: string]: string | number | boolean | undefined;
}

// 格式化输入内容的工具函数
const formatHblInput = (value: string) => {
  // 移除全角字符，转换为半角
  const halfWidth = value.replace(/[\uFF01-\uFF5E]/g, char => 
    String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  );
  // 转大写并只保留允许的字符（大写字母、数字、横杠、斜杠）
  const formatted = halfWidth.toUpperCase().replace(/[^A-Z0-9\-\/]/g, '');
  // 限制长度为16个字符
  return formatted.slice(0, 16);
};

// 格式化 MBL 输入内容的工具函数
const formatMblInput = (value: string) => {
  // 移除全角字符，转换为半角
  const halfWidth = value.replace(/[\uFF01-\uFF5E]/g, char => 
    String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  );
  // 转大写并只保留允许的字符（大写字母、数字、横杠、斜杠）
  const formatted = halfWidth.toUpperCase().replace(/[^A-Z0-9\-\/]/g, '');
  // 限制长度为21个字符
  return formatted.slice(0, 21);
};

// 格式化航次输入
const formatVoyageInput = (value: string) => {
  // 只保留大写字母、数字和横杠
  const formatted = value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  // 限制长度为5个字符
  return formatted.slice(0, 5);
};

// 定义表单值的类型
interface FormValues {
  consignee?: string;
  consigneeCountry?: string;
  consigneeCity?: string;
  consigneePhone?: string;
  consigneeAddress?: string;
  notifyParty?: string;
  notifyPartyCountry?: string;
  notifyPartyCity?: string;
  notifyPartyPhone?: string;
  notifyPartyAddress?: string;
  [key: string]: string | undefined;
}

// 国家选项类型
interface CountryOption {
  label: string;
  value: string;
}

// 国家选项
const COUNTRY_OPTIONS: CountryOption[] = [
  { label: 'CN | China | 中国', value: 'CN' },
  { label: 'JP | Japan | 日本', value: 'JP' },
  { label: 'KR | Korea | 韩国', value: 'KR' },
  { label: 'HK | Hong Kong | 中国香港', value: 'HK' },
  { label: 'TW | Taiwan | 中国台湾', value: 'TW' },
  { label: 'SG | Singapore | 新加坡', value: 'SG' },
  { label: 'MY | Malaysia | 马来西亚', value: 'MY' },
  { label: 'ID | Indonesia | 印度尼西亚', value: 'ID' },
  { label: 'TH | Thailand | 泰国', value: 'TH' },
  { label: 'VN | Vietnam | 越南', value: 'VN' },
  { label: 'PH | Philippines | 菲律宾', value: 'PH' },
  { label: 'US | United States | 美国', value: 'US' },
  { label: 'CA | Canada | 加拿大', value: 'CA' },
  { label: 'MX | Mexico | 墨西哥', value: 'MX' },
  { label: 'BR | Brazil | 巴西', value: 'BR' },
  { label: 'GB | United Kingdom | 英国', value: 'GB' },
  { label: 'DE | Germany | 德国', value: 'DE' },
  { label: 'FR | France | 法国', value: 'FR' },
  { label: 'IT | Italy | 意大利', value: 'IT' },
  { label: 'ES | Spain | 西班牙', value: 'ES' },
  { label: 'NL | Netherlands | 荷兰', value: 'NL' },
  { label: 'BE | Belgium | 比利时', value: 'BE' },
  { label: 'CH | Switzerland | 瑞士', value: 'CH' },
  { label: 'SE | Sweden | 瑞典', value: 'SE' },
  { label: 'NO | Norway | 挪威', value: 'NO' },
  { label: 'DK | Denmark | 丹麦', value: 'DK' },
  { label: 'FI | Finland | 芬兰', value: 'FI' },
  { label: 'RU | Russia | 俄罗斯', value: 'RU' },
  { label: 'AU | Australia | 澳大利亚', value: 'AU' },
  { label: 'NZ | New Zealand | 新西兰', value: 'NZ' }
];

// 格式化抬头和地址输入
const formatHeaderAndAddress = (value: string) => {
  // 移除全角字符，转换为半角
  const halfWidth = value.replace(/[\uFF01-\uFF5E]/g, char => 
    String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  );
  // 只保留允许的字符：大小写字母、数字、短横杠、斜杠、逗号、空格、冒号、引号、加号、下划线
  return halfWidth.replace(/[^a-zA-Z0-9\-\/,\s:'"_+]/g, '');
};

// 格式化电话号码
const formatPhoneNumber = (value: string) => {
  // 只保留数字、空格和短横杠
  const formatted = value.replace(/[^\d\s-]/g, '');
  return formatted.slice(0, 14);
};

// 箱货信息类型
interface ContainerInfo {
  id: string;
  containerNo?: string;
  containerType?: string;
  sealNo?: string;
  mark?: string;
  goodsName?: string;
  packageCount?: number;
  packageUnit?: string;
  grossWeight?: number;
  volume?: number;
  hsCode?: string;
  dangerousGoodsCodes: string[];
}

// 格式化箱号输入
const formatContainerNo = (value: string) => {
  // 转换为大写
  const upperValue = value.toUpperCase();
  
  // 分别处理字母部分和数字部分
  let letters = '';
  let numbers = '';
  
  // 处理前4位字母
  const lettersPart = upperValue.match(/[A-Z]{0,4}/)?.[0] || '';
  letters = lettersPart.slice(0, 4);
  
  // 如果有第4位字母且不是U,则强制替换为U
  if (letters.length === 4 && letters[3] !== 'U') {
    letters = letters.slice(0, 3) + 'U';
  }
  
  // 处理后7位数字
  const numbersPart = upperValue.match(/\d{0,7}/g)?.join('') || '';
  numbers = numbersPart.slice(0, 7);
  
  // 组合结果
  return letters + numbers;
};

// 验证箱号格式
const validateContainerNo = (value: string) => {
  if (!value) return false;
  // 必须是4位大写字母(第4位是U)+7位数字
  const pattern = /^[A-Z]{3}U\d{7}$/;
  return pattern.test(value);
};

// 箱型选项类型定义
interface ContainerTypeOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

interface ContainerTypeGroup {
  label: React.ReactNode;
  value?: string;
  options: ContainerTypeOption[];
}

// 常用箱型选项
const COMMON_CONTAINER_TYPES = [
  { label: '40HC-40尺高箱', value: '40HC' },
  { label: '20GP-20尺标准箱', value: '20GP' },
  { label: '40GP-40尺标准箱', value: '40GP' }
];

// 其他箱型选项
const OTHER_CONTAINER_TYPES = [
  { label: '10FR-10尺框架箱', value: '10FR' },
  { label: '10GP-10尺标准箱', value: '10GP' },
  { label: '10HC-10尺高箱', value: '10HC' },
  { label: '10NOR-10尺冷冻代干箱', value: '10NOR' },
  { label: '10OT-10尺开顶箱', value: '10OT' },
  { label: '10PF-10尺平板箱', value: '10PF' },
  { label: '10RF-10尺普通冷冻箱', value: '10RF' },
  { label: '10RH-10尺冷冻高箱', value: '10RH' },
  { label: '10TK-10尺坦克箱', value: '10TK' },
  { label: '10VE-10尺通风箱', value: '10VE' },
  { label: '20FR-20尺框架箱', value: '20FR' },
  { label: '20HT-20尺挂衣箱', value: '20HT' },
  { label: '20HC-20尺高箱', value: '20HC' },
  { label: '20NOR-20尺冷冻代干箱', value: '20NOR' },
  { label: '20OT-20尺开顶箱', value: '20OT' },
  { label: '20PF-20尺平板箱', value: '20PF' },
  { label: '20RF-20尺普通冷冻箱', value: '20RF' },
  { label: '20RH-20尺冷冻高箱', value: '20RH' },
  { label: '20TK-20尺坦克箱', value: '20TK' },
  { label: '20VE-20尺通风箱', value: '20VE' },
  { label: '40FR-40尺框架箱', value: '40FR' },
  { label: '40HT-40尺挂衣箱', value: '40HT' },
  { label: '40HG-40尺挂衣高箱', value: '40HG' },
  { label: '40NOR-40尺冷冻代干箱', value: '40NOR' },
  { label: '40NORH-40尺冷冻代干高箱', value: '40NORH' },
  { label: '40OT-40尺开顶箱', value: '40OT' },
  { label: '40PF-40尺平板箱', value: '40PF' },
  { label: '40RF-40尺普通冷冻箱', value: '40RF' },
  { label: '40RH-40尺冷冻高箱', value: '40RH' },
  { label: '40TK-40尺坦克箱', value: '40TK' },
  { label: '40VE-40尺通风箱', value: '40VE' },
  { label: '45GP-45尺标准箱', value: '45GP' },
  { label: '45HC-45尺高箱', value: '45HC' },
  { label: '45RF-45尺普通冷冻箱', value: '45RF' },
  { label: '48GP-48尺标准箱', value: '48GP' },
  { label: '48HC-48尺高箱', value: '48HC' },
  { label: '53GP-53尺标准箱', value: '53GP' },
  { label: '53HC-53尺高箱', value: '53HC' },
  { label: '其他尺寸标准箱', value: 'OTHER' }
];

// 格式化封号输入
const formatSealNo = (value: string) => {
  // 移除全角字符，转换为半角
  const halfWidth = value.replace(/[\uFF01-\uFF5E]/g, char => 
    String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  );
  // 转大写并只保留允许的字符（大写字母、数字、横杠）
  const formatted = halfWidth.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  // 限制长度为15个字符
  return formatted.slice(0, 15);
};

// 包装单位选项
const PACKAGE_UNITS = [
  { label: 'CT-Carton | 纸箱', value: 'CT' },
  { label: 'PP&Pallet & Package | 托盘包装', value: 'PP' },
  { label: 'PK-PACKAGE | 包', value: 'PK' },
  { label: 'BG-BAG | 袋', value: 'BG' },
  { label: 'BE-Bundle | 捆', value: 'BE' },
  { label: 'OT-other | 其他', value: 'OT' },
  { label: 'PSS-PIECES | 件', value: 'PSS' }
];

const EditPageContent = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [copyToNotify, setCopyToNotify] = useState(true);
  const [hblInputCount, setHblInputCount] = useState(0);
  const [mblInputCount, setMblInputCount] = useState(0);
  const [mblPrefix, setMblPrefix] = useState('');
  const [mblPrefixError, setMblPrefixError] = useState(false);
  const [voyageInputCount, setVoyageInputCount] = useState(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 添加展开/收起状态
  const [expandStatus, setExpandStatus] = useState({
    basic: true,
    contact: true,
    cargo: true
  });

  // 切换展开/收起状态
  const toggleExpand = (section: 'basic' | 'contact' | 'cargo') => {
    setExpandStatus(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 根据 id 判断是新增还是编辑模式
  const isEdit = !!id;

  // 获取 AFR 详情
  const fetchAfrDetail = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/afr/${id}`);
      const data = await response.json();
      form.setFieldsValue(data);
    } catch (error) {
      console.error('获取AFR详情失败:', error);
    }
  }, [id, form]);

  // 初始化数据
  useEffect(() => {
    if (id) {
      fetchAfrDetail();
    }
  }, [id, fetchAfrDetail]);

  // 处理收货人信息变化
  const handleConsigneeChange = (value: string | undefined, values: FormValues) => {
    if (!copyToNotify) return;

    const fieldMap = {
      consignee: 'notifyParty',
      consigneeCountry: 'notifyPartyCountry',
      consigneeCity: 'notifyPartyCity',
      consigneePhone: 'notifyPartyPhone',
      consigneeAddress: 'notifyPartyAddress'
    } as const;

    const updates: Partial<FormValues> = {};
    Object.entries(values).forEach(([key, value]) => {
      const notifyKey = fieldMap[key as keyof typeof fieldMap];
      if (notifyKey && value !== undefined) {
        updates[notifyKey] = value;
      }
    });

    if (Object.keys(updates).length > 0) {
      form.setFieldsValue(updates);
    }
  };

  // 处理船公司选择变化
  const handleCarrierChange = (value: string) => {
    const carrier = CARRIERS.find(c => c.value === value);
    if (carrier) {
      setMblPrefix(carrier.value);
      form.setFieldValue('mblPrefix', carrier.value);
      
      // 检查当前 MBL 输入值是否与新的前缀重复
      const currentMblInput = form.getFieldValue('mblInput');
      if (currentMblInput && carrier.value && currentMblInput.toUpperCase().startsWith(carrier.value)) {
        setMblPrefixError(true);
      } else {
        setMblPrefixError(false);
      }
    } else {
      // 如果清空船公司选择，也要清空前缀并重置错误状态
      setMblPrefix('');
      form.setFieldValue('mblPrefix', '');
      setMblPrefixError(false);
    }
  };

  // MBL输入框变化处理
  const handleMblInputChange = (value: string) => {
    const formatted = formatMblInput(value);
    setMblInputCount(formatted.length);
    form.setFieldValue('mblInput', formatted);

    // 检查前缀是否重复
    if (mblPrefix && formatted.toUpperCase().startsWith(mblPrefix)) {
      setMblPrefixError(true);
    } else {
      setMblPrefixError(false);
    }
  };

  // MBL输入框粘贴处理
  const handleMblPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatMblInput(pastedText);
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    
    const currentValue = form.getFieldValue('mblInput') || '';
    const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
    const finalValue = formatMblInput(newValue);
    
    form.setFieldValue('mblInput', finalValue);
    setMblInputCount(finalValue.length);

    // 检查前缀是否重复
    if (mblPrefix && finalValue.toUpperCase().startsWith(mblPrefix)) {
      setMblPrefixError(true);
    } else {
      setMblPrefixError(false);
    }
  };

  // 处理航次输入变化
  const handleVoyageChange = (value: string) => {
    const formatted = formatVoyageInput(value);
    setVoyageInputCount(formatted.length);
    form.setFieldValue('voyage', formatted);
  };

  // 处理航次粘贴
  const handleVoyagePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatVoyageInput(pastedText);
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    
    const currentValue = form.getFieldValue('voyage') || '';
    const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
    const finalValue = formatVoyageInput(newValue);
    
    form.setFieldValue('voyage', finalValue);
    setVoyageInputCount(finalValue.length);
  };

  const handleSubmit = async () => {
    try {
      await form.validate();
      const values = form.getFieldsValue();
      
      // 根据模式调用不同的 API
      if (isEdit) {
        // TODO: 调用编辑 API
        await fetch(`/api/afr/${id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
      } else {
        // TODO: 调用新增 API
        await fetch('/api/afr', {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }

      // 提交成功后返回列表页
      router.push('/customs/afr');
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  const handleCopy = () => {
    // 复制当前表单数据，并跳转到新增页面
    const currentData = form.getFieldsValue();
    router.push('/customs/afr/edit');
    // 延迟设置表单数据，确保页面已经切换到新增模式
    setTimeout(() => {
      form.setFieldsValue({
        ...currentData,
        hblNo: 'J76N', // 复制时重置 HBL No.
      });
    }, 0);
  };

  const handleBack = () => {
    router.push('/customs/afr');
  };

  const [containers, setContainers] = useState<ContainerInfo[]>([
    { id: '1', dangerousGoodsCodes: [] } // 初始化一个空的箱货信息，包含空的危险品编号数组
  ]);
  const [activeTab, setActiveTab] = useState('1');

  // 计算总计数据
  const calculateTotals = useCallback(() => {
    return containers.reduce((acc, container) => {
      return {
        packageCount: acc.packageCount + (Number(container.packageCount) || 0),
        grossWeight: acc.grossWeight + (Number(container.grossWeight) || 0),
        volume: acc.volume + (Number(container.volume) || 0)
      };
    }, { packageCount: 0, grossWeight: 0, volume: 0 });
  }, [containers]);

  // 添加新箱号
  const handleAddContainer = () => {
    const newId = String(containers.length + 1);
    setContainers([...containers, { id: newId, dangerousGoodsCodes: [] }]);
    setActiveTab(newId);
  };

  // 删除箱号
  const handleDeleteContainer = (targetId: string) => {
    if (containers.length === 1) {
      return; // 至少保留一个箱号
    }
    const newContainers = containers.filter(c => c.id !== targetId);
    setContainers(newContainers);
    setActiveTab(newContainers[0].id);
  };

  // 更新箱货信息
  const handleContainerChange = (id: string, field: keyof ContainerInfo, value: any) => {
    setContainers(prev => prev.map(container => {
      if (container.id === id) {
        if (field === 'dangerousGoodsCodes') {
          return { ...container, dangerousGoodsCodes: value };
        }
        return { ...container, [field]: value };
      }
      return container;
    }));
  };

  // 添加危险品编号输入框
  const handleAddDangerousCode = (containerId: string) => {
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        if (container.dangerousGoodsCodes.length >= 99) {
          Message.warning('最多只能添加99个危险品编号');
          return container;
        }
        return {
          ...container,
          dangerousGoodsCodes: [...container.dangerousGoodsCodes, '']
        };
      }
      return container;
    }));
  };

  // 删除危险品编号输入框
  const handleDeleteDangerousCode = (containerId: string, index: number) => {
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        const newCodes = [...container.dangerousGoodsCodes];
        newCodes.splice(index, 1);
        return {
          ...container,
          dangerousGoodsCodes: newCodes
        };
      }
      return container;
    }));
  };

  // 更新危险品编号值
  const handleDangerousCodeChange = (containerId: string, index: number, value: string) => {
    setContainers(prev => prev.map(container => {
      if (container.id === containerId) {
        const newCodes = [...container.dangerousGoodsCodes];
        newCodes[index] = value;
        return {
          ...container,
          dangerousGoodsCodes: newCodes
        };
      }
      return container;
    }));
  };

  // 定义 HBL 前缀选项
  const HBL_PREFIX_OPTIONS = [
    { label: 'J76N', value: 'J76N' }
  ];

  // 定义船公司选项
  const CARRIER_OPTIONS = CARRIERS.map(carrier => ({
    label: carrier.label,
    value: carrier.value
  }));

  // 定义运输方式选项
  const TRANSPORT_MODE_OPTIONS = TRANSPORT_MODES.map(mode => ({
    label: mode.label,
    value: mode.value
  }));

  return (
    <div className={styles.formContainer}>
      <Form 
        form={form} 
        layout="vertical"
        onChange={(value: FormChangeValues, values: FormChangeValues) => {
          if (typeof value === 'string') {
            handleConsigneeChange(value, values as FormValues);
          }
        }}
      >
        {/* 基础信息 */}
        <Card className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>基础信息</div>
            <Button 
              type="text" 
              className="text-[#4E5969]"
              onClick={() => toggleExpand('basic')}
              icon={expandStatus.basic ? <IconUp /> : <IconDown />}
            >
              {expandStatus.basic ? '收起' : '展开'}
            </Button>
          </div>
          <div className={`${styles.formContent} ${expandStatus.basic ? '' : styles.collapsed}`}>
            <div className={styles.formSection}>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>HBL No.</>} field="hblNo">
                <div className="flex items-center">
                  <Select 
                    className={styles.hblPrefix}
                    defaultValue="J76N"
                    options={HBL_PREFIX_OPTIONS}
                  />
                  <Input 
                    className={styles.hblInput} 
                    placeholder="请输入" 
                    value={form.getFieldValue('hblNo')}
                    onChange={(value) => {
                      const formatted = formatHblInput(value);
                      setHblInputCount(formatted.length);
                      form.setFieldValue('hblInput', formatted);
                    }}
                  />
                </div>
              </FormItem>
              <FormItem className={`${styles.formItem} flex-1`} label={<>船公司<span className="required-mark">*</span></>} field="carrier">
                <Select 
                  className={styles.carrierSelect} 
                  placeholder="请选择"
                  allowClear
                  showSearch
                  onChange={handleCarrierChange}
                  options={CARRIER_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return CARRIER_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              </FormItem>
              <FormItem 
                className={styles.formItem} 
                label={<><span className="required-mark">*</span>MBL No.</>} 
                field="mblNo"
                validateStatus={mblPrefixError ? 'error' : undefined}
                help={mblPrefixError ? '提单前缀不可重复，请删掉后重试' : undefined}
              >
                <div className="flex items-center flex-nowrap">
                  <Input 
                    className={styles.mblPrefix}
                    value={mblPrefix}
                    disabled
                    placeholder="前缀"
                  />
                  <Input 
                    className={`${styles.mblInput} ${mblPrefixError ? styles.errorInput : ''}`}
                    placeholder="请输入" 
                    onChange={handleMblInputChange}
                    onPaste={handleMblPaste}
                    maxLength={21}
                    value={form.getFieldValue('mblInput')}
                    suffix={`${mblInputCount}/21`}
                  />
                </div>
              </FormItem>
              <FormItem className={styles.formItem} label={<>运输方式<span className="required-mark">*</span></>} field="transportMode">
                <Select 
                  className={styles.transportSelect} 
                  placeholder="请选择"
                  defaultValue="PortToPort"
                  allowClear
                  options={TRANSPORT_MODE_OPTIONS}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<>船名<span className="required-mark">*</span></>} field="vesselName">
                <Select 
                  className={styles.vesselSelect} 
                  placeholder="请选择"
                  allowClear
                  showSearch
                  options={VESSEL_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return VESSEL_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<>航次<span className="required-mark">*</span></>} field="voyage">
                <Input 
                  className={styles.voyageInput} 
                  placeholder="请输入" 
                  onChange={handleVoyageChange}
                  onPaste={handleVoyagePaste}
                  maxLength={5}
                  value={form.getFieldValue('voyage')}
                  suffix={`${voyageInputCount}/5`}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>ETD</>} field="etd">
                <DatePicker 
                  className={`${styles.input} !w-full`} 
                  placeholder="请选择" 
                  format="YYYY-MM-DD"
                  onChange={(value) => {
                    // 当 ETD 改变时，如果 ETA 在 ETD 之前，清空 ETA
                    const eta = form.getFieldValue('eta');
                    if (eta && value && new Date(eta) < new Date(value)) {
                      form.setFieldValue('eta', null);
                    }
                  }}
                />
              </FormItem>
              <FormItem 
                className={styles.formItem} 
                label={<><span className="required-mark">*</span>ETA</>} 
                field="eta"
                rules={[
                  {
                    validator: (value, callback) => {
                      if (!value) {
                        return callback('请选择到达日期');
                      }
                      const etaDate = new Date(value);
                      const etdValue = form.getFieldValue('etd');
                      
                      if (etaDate < today) {
                        return callback('到达日期不能早于今天');
                      }
                      
                      if (etdValue && etaDate < new Date(etdValue)) {
                        return callback('到达日期不能早于出发日期');
                      }
                      callback();
                    }
                  }
                ]}
              >
                <DatePicker 
                  className={`${styles.input} !w-full`} 
                  placeholder="请选择" 
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    // 禁用今天之前的日期
                    if (current.valueOf() < today.valueOf()) {
                      return true;
                    }
                    // 禁用早于 ETD 的日期
                    const etdValue = form.getFieldValue('etd');
                    if (etdValue && current.valueOf() < new Date(etdValue).valueOf()) {
                      return true;
                    }
                    return false;
                  }}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>收货地</>} field="receiptPlace">
                <Select 
                  className={`${styles.input} !w-full`}
                  placeholder="请选择"
                  showSearch
                  allowClear
                  options={PORT_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return PORT_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>装货港</>} field="loadingPort">
                <Select 
                  className={`${styles.input} !w-full`}
                  placeholder="请选择"
                  showSearch
                  allowClear
                  options={PORT_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return PORT_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                  onChange={(value) => {
                    // 如果收货地为空，自动复制装货港的值
                    const receiptPlace = form.getFieldValue('receiptPlace');
                    if (!receiptPlace && value) {
                      form.setFieldValue('receiptPlace', value);
                    }
                  }}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>卸货港</>} field="dischargePort">
                <Select 
                  className={`${styles.input} !w-full`}
                  placeholder="请选择"
                  showSearch
                  allowClear
                  options={PORT_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return PORT_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>目的地</>} field="destinationPlace">
                <Select 
                  className={`${styles.input} !w-full`}
                  placeholder="请选择"
                  showSearch
                  allowClear
                  options={PORT_OPTIONS}
                  filterOption={false}
                  onSearch={(inputValue) => {
                    return PORT_OPTIONS.filter(option => 
                      option.label.toString().toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              </FormItem>
            </div>
          </div>
        </Card>

        {/* 收发通信息 */}
        <Card className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>收发通信息</div>
            <Button 
              type="text" 
              className="text-[#4E5969]"
              onClick={() => toggleExpand('contact')}
              icon={expandStatus.contact ? <IconUp /> : <IconDown />}
            >
              {expandStatus.contact ? '收起' : '展开'}
            </Button>
          </div>
          <div className={`${styles.formContent} ${expandStatus.contact ? '' : styles.collapsed}`}>
            <div className={styles.contactContainer}>
              {/* 左右布局容器 */}
              <div className={styles.contactRow}>
                {/* 发货人信息 - 左半部分 */}
                <div className={styles.contactColumn}>
                  <div className={styles.titleField}>
                    <span>发货人信息</span>
                  </div>
                  <FormItem 
                    className={`${styles.formItem} ${styles.fullWidth}`} 
                    label={<><span className="required-mark">*</span>发货人抬头</>} 
                    field="shipper"
                  >
                    <Input 
                      className={`flex-1 ${styles.input}`} 
                      placeholder={'请输入（仅限字母、数字、-/,:"\'+_）'} 
                      maxLength={70}
                      onChange={(value) => {
                        const formatted = formatHeaderAndAddress(value);
                        form.setFieldValue('shipper', formatted);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const formatted = formatHeaderAndAddress(pastedText);
                        const input = e.target as HTMLInputElement;
                        const start = input.selectionStart || 0;
                        const end = input.selectionEnd || 0;
                        
                        const currentValue = form.getFieldValue('shipper') || '';
                        const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                        const finalValue = formatHeaderAndAddress(newValue).slice(0, 70);
                        
                        form.setFieldValue('shipper', finalValue);
                      }}
                      onKeyPress={(e) => {
                        // 阻止不合规字符的输入
                        if (!/[a-zA-Z0-9\-\/,\s:'"_+]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormItem>
                  <div className={styles.formSection}>
                    <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="shipperCountry">
                      <Select 
                        className={styles.select} 
                        placeholder="请选择"
                        showSearch
                        allowClear
                        options={COUNTRY_OPTIONS}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="shipperPhone">
                      <Input 
                        className={styles.input} 
                        placeholder="请输入（仅限数字、空格和-）" 
                        maxLength={14}
                        onChange={(value) => {
                          const formatted = formatPhoneNumber(value);
                          form.setFieldValue('shipperPhone', formatted);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const formatted = formatPhoneNumber(pastedText);
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          
                          const currentValue = form.getFieldValue('shipperPhone') || '';
                          const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                          const finalValue = formatPhoneNumber(newValue);
                          
                          form.setFieldValue('shipperPhone', finalValue);
                        }}
                        onKeyPress={(e) => {
                          // 阻止不合规字符的输入
                          if (!/[\d\s-]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormItem>
                  </div>
                  <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="shipperAddress">
                    <Input.TextArea 
                      className={`${styles.input} ${styles.resizableInput}`} 
                      placeholder={'请输入（仅限字母、数字、-/,:"\'+_）'} 
                      maxLength={140}
                      showWordLimit
                      onChange={(value) => {
                        const formatted = formatHeaderAndAddress(value);
                        form.setFieldValue('shipperAddress', formatted);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const formatted = formatHeaderAndAddress(pastedText);
                        const input = e.target as HTMLTextAreaElement;
                        const start = input.selectionStart || 0;
                        const end = input.selectionEnd || 0;
                        
                        const currentValue = form.getFieldValue('shipperAddress') || '';
                        const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                        const finalValue = formatHeaderAndAddress(newValue).slice(0, 140);
                        
                        form.setFieldValue('shipperAddress', finalValue);
                      }}
                      onKeyPress={(e) => {
                        // 阻止不合规字符的输入
                        if (!/[a-zA-Z0-9\-\/,\s:'"_+]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormItem>
                </div>

                {/* 收货人信息 - 右半部分 */}
                <div className={styles.contactColumn}>
                  <div className={styles.titleField}>
                    <span>收货人信息</span>
                    <Checkbox 
                      checked={copyToNotify}
                      onChange={(checked) => setCopyToNotify(checked)}
                    >
                      复制到通知人
                    </Checkbox>
                  </div>
                  <FormItem 
                    className={`${styles.formItem} ${styles.fullWidth}`} 
                    label={<><span className="required-mark">*</span>收货人抬头</>} 
                    field="consignee"
                  >
                    <Input className={`flex-1 ${styles.input}`} placeholder="请输入" suffix="0/70" maxLength={70} />
                  </FormItem>
                  <div className={styles.formSection}>
                    <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="consigneeCountry">
                      <Select 
                        className={styles.select} 
                        placeholder="请选择"
                        showSearch
                        allowClear
                        options={COUNTRY_OPTIONS}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="consigneePhone">
                      <Input 
                        className={styles.input} 
                        placeholder="请输入（仅限数字、空格和-）" 
                        maxLength={14}
                        onChange={(value) => {
                          const formatted = formatPhoneNumber(value);
                          form.setFieldValue('consigneePhone', formatted);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const formatted = formatPhoneNumber(pastedText);
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          
                          const currentValue = form.getFieldValue('consigneePhone') || '';
                          const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                          const finalValue = formatPhoneNumber(newValue);
                          
                          form.setFieldValue('consigneePhone', finalValue);
                        }}
                        onKeyPress={(e) => {
                          if (!/[\d\s-]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormItem>
                  </div>
                  <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="consigneeAddress">
                    <Input.TextArea 
                      className={`${styles.input} ${styles.resizableInput}`} 
                      placeholder="请输入（最多140字）" 
                      maxLength={140} 
                      showWordLimit
                    />
                  </FormItem>
                </div>
              </div>

              {/* 通知人信息 - 仅在未选中复制到通知人时显示 */}
              {!copyToNotify && (
                <div className={styles.notifyPartySection}>
                  <div className={styles.titleField}>
                    <span>通知人信息</span>
                  </div>
                  <FormItem 
                    className={`${styles.formItem} ${styles.fullWidth}`} 
                    label={<><span className="required-mark">*</span>通知人抬头</>}
                    field="notifyParty"
                  >
                    <Input className={`flex-1 ${styles.input}`} placeholder="请输入" suffix="0/70" maxLength={70} />
                  </FormItem>
                  <div className={styles.formSection}>
                    <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="notifyPartyCountry">
                      <Select 
                        className={styles.select} 
                        placeholder="请选择"
                        showSearch
                        allowClear
                        options={COUNTRY_OPTIONS}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="notifyPartyPhone">
                      <Input 
                        className={styles.input} 
                        placeholder="请输入（仅限数字、空格和-）" 
                        maxLength={14}
                        onChange={(value) => {
                          const formatted = formatPhoneNumber(value);
                          form.setFieldValue('notifyPartyPhone', formatted);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const formatted = formatPhoneNumber(pastedText);
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          
                          const currentValue = form.getFieldValue('notifyPartyPhone') || '';
                          const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                          const finalValue = formatPhoneNumber(newValue);
                          
                          form.setFieldValue('notifyPartyPhone', finalValue);
                        }}
                        onKeyPress={(e) => {
                          if (!/[\d\s-]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormItem>
                  </div>
                  <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="notifyPartyAddress">
                    <Input.TextArea 
                      className={`${styles.input} ${styles.resizableInput}`} 
                      placeholder="请输入（最多140字）" 
                      maxLength={140} 
                      showWordLimit
                    />
                  </FormItem>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 箱货信息 */}
        <Card className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>箱货信息</div>
            <Space>
              <div className={styles.totalInfo}>
                总计：件数：{calculateTotals().packageCount} 毛重：{calculateTotals().grossWeight.toFixed(3)} 体积：{calculateTotals().volume.toFixed(3)}
              </div>
              <Button 
                type="text" 
                className="text-[#4E5969]"
                onClick={() => toggleExpand('cargo')}
                icon={expandStatus.cargo ? <IconUp /> : <IconDown />}
              >
                {expandStatus.cargo ? '收起' : '展开'}
              </Button>
            </Space>
          </div>
          <div className={`${styles.formContent} ${expandStatus.cargo ? '' : styles.collapsed}`}>
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              type="card-gutter"
              className={styles.containerTabs}
              extra={
                <Button type="text" className={styles.addTabButton} icon={<IconPlus />} onClick={handleAddContainer}>
                  添加箱号
                </Button>
              }
            >
              {containers.map((container, index) => (
                <Tabs.TabPane 
                  key={container.id}
                  title={
                    <Space>
                      <span>{container.containerNo || `箱号 ${index + 1}`}</span>
                      {containers.length > 1 && (
                        <IconDelete 
                          className={styles.deleteIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContainer(container.id);
                          }}
                        />
                      )}
                    </Space>
                  }
                >
                  <div className={styles.formSection}>
                    <FormItem 
                      className={styles.formItem} 
                      label={<><span className="required-mark">*</span>箱号</>} 
                      field={`containerNo_${container.id}`}
                      validateStatus={container.containerNo && !validateContainerNo(container.containerNo) ? 'error' : undefined}
                      help={container.containerNo && !validateContainerNo(container.containerNo) ? '请输入4位大写字母(第4位必须是U)+7位数字' : undefined}
                    >
                      <Input 
                        className={styles.input} 
                        placeholder="请输入4位大写字母(第4位必须是U)+7位数字" 
                        suffix={`${container.containerNo?.length || 0}/11`}
                        value={container.containerNo}
                        onChange={(value) => {
                          const formatted = formatContainerNo(value);
                          handleContainerChange(container.id, 'containerNo', formatted);
                        }}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>箱型</>} field={`containerType_${container.id}`}>
                      <Select 
                        className={styles.select} 
                        placeholder="请选择"
                        value={container.containerType}
                        onChange={(value) => handleContainerChange(container.id, 'containerType', value)}
                      >
                        <Select.OptGroup label="常用箱型">
                          {COMMON_CONTAINER_TYPES.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select.OptGroup>
                        <Select.OptGroup label="其他箱型">
                          {OTHER_CONTAINER_TYPES.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select.OptGroup>
                      </Select>
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>封号</>} field={`sealNo_${container.id}`}>
                      <Input 
                        className={styles.input} 
                        placeholder="请输入（仅限大写字母、数字、横杠）" 
                        value={container.sealNo}
                        onChange={(value) => {
                          const formatted = formatSealNo(value);
                          handleContainerChange(container.id, 'sealNo', formatted);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const formatted = formatSealNo(pastedText);
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          
                          const currentValue = container.sealNo || '';
                          const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                          const finalValue = formatSealNo(newValue);
                          
                          handleContainerChange(container.id, 'sealNo', finalValue);
                        }}
                        onKeyPress={(e) => {
                          if (!/[A-Za-z0-9\-]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={15}
                        suffix={`${container.sealNo?.length || 0}/15`}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>HS Code</>} field={`hsCode_${container.id}`}>
                      <Input 
                        className={styles.input} 
                        placeholder="请输入" 
                        suffix="0/6"
                        value={container.hsCode}
                        onChange={(value) => handleContainerChange(container.id, 'hsCode', value)}
                      />
                    </FormItem>
                  </div>
                  <div className={styles.formSection}>
                    <div className={styles.contactColumn}>
                      <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label="唛头" field={`mark_${container.id}`}>
                        <Input.TextArea 
                          className={`${styles.input} ${styles.resizableInput}`} 
                          placeholder={'请输入（仅限字母、数字、-/,:"\'+_）'} 
                          maxLength={140}
                          showWordLimit
                          value={container.mark}
                          onChange={(value) => {
                            const formatted = formatHeaderAndAddress(value);
                            handleContainerChange(container.id, 'mark', formatted);
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text');
                            const formatted = formatHeaderAndAddress(pastedText);
                            const input = e.target as HTMLTextAreaElement;
                            const start = input.selectionStart || 0;
                            const end = input.selectionEnd || 0;
                            
                            const currentValue = container.mark || '';
                            const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                            const finalValue = formatHeaderAndAddress(newValue).slice(0, 140);
                            
                            handleContainerChange(container.id, 'mark', finalValue);
                          }}
                          onKeyPress={(e) => {
                            if (!/[a-zA-Z0-9\-\/,\s:'"_+]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className={styles.contactColumn}>
                      <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<><span className="required-mark">*</span>品名</>} field={`goodsName_${container.id}`}>
                        <Input.TextArea 
                          className={`${styles.input} ${styles.resizableInput}`} 
                          placeholder={'请输入（仅限字母、数字、-/,:"\'+_）'} 
                          maxLength={350}
                          showWordLimit
                          value={container.goodsName}
                          onChange={(value) => {
                            const formatted = formatHeaderAndAddress(value);
                            handleContainerChange(container.id, 'goodsName', formatted);
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text');
                            const formatted = formatHeaderAndAddress(pastedText);
                            const input = e.target as HTMLTextAreaElement;
                            const start = input.selectionStart || 0;
                            const end = input.selectionEnd || 0;
                            
                            const currentValue = container.goodsName || '';
                            const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
                            const finalValue = formatHeaderAndAddress(newValue).slice(0, 350);
                            
                            handleContainerChange(container.id, 'goodsName', finalValue);
                          }}
                          onKeyPress={(e) => {
                            if (!/[a-zA-Z0-9\-\/,\s:'"_+]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                  <div className={styles.formSection}>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>件数</>} field={`packageCount_${container.id}`}>
                      <Input 
                        className={styles.input} 
                        placeholder="请输入"
                        value={container.packageCount?.toString()}
                        onChange={(value) => {
                          // 移除非数字字符
                          const numStr = value.replace(/\D/g, '');
                          // 移除前导零
                          const normalizedStr = numStr.replace(/^0+/, '') || '0';
                          // 转换为数字并检查范围
                          const num = parseInt(normalizedStr);
                          if (num >= 0 && num <= 999999) {
                            handleContainerChange(container.id, 'packageCount', num);
                          }
                        }}
                        onKeyPress={(e) => {
                          // 阻止输入非数字字符
                          if (!/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                          // 获取当前值并检查长度
                          const input = e.target as HTMLInputElement;
                          if (input.value.length >= 6 && input.selectionStart === input.selectionEnd) {
                            e.preventDefault();
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            // 确保值在有效范围内
                            const num = parseInt(value);
                            if (num >= 0 && num <= 999999) {
                              handleContainerChange(container.id, 'packageCount', num);
                            } else if (num > 999999) {
                              handleContainerChange(container.id, 'packageCount', 999999);
                            }
                          }
                        }}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>包装单位</>} field={`packageUnit_${container.id}`}>
                      <Select 
                        className={styles.select} 
                        placeholder="请选择"
                        value={container.packageUnit}
                        onChange={(value) => handleContainerChange(container.id, 'packageUnit', value)}
                        options={PACKAGE_UNITS}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>毛重</>} field={`grossWeight_${container.id}`}>
                      <Input 
                        className={styles.input} 
                        placeholder="请输入" 
                        suffix="KGS"
                        type="number"
                        step="0.001"
                        min={0}
                        value={container.grossWeight?.toString()}
                        onChange={(value) => {
                          // 限制小数点后3位
                          const numValue = Number(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            const formatted = Number(numValue.toFixed(3));
                            handleContainerChange(container.id, 'grossWeight', formatted);
                          }
                        }}
                        onKeyPress={(e) => {
                          // 只允许输入数字和小数点
                          if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                          }
                          // 如果已经有小数点且用户又输入小数点，阻止输入
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault();
                          }
                          // 如果小数点后已有3位数字，阻止继续输入
                          const value = (e.target as HTMLInputElement).value;
                          const decimalPart = value.split('.')[1];
                          if (decimalPart && decimalPart.length >= 3 && e.key !== '.') {
                            e.preventDefault();
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            const formatted = Number(Number(value).toFixed(3));
                            handleContainerChange(container.id, 'grossWeight', formatted);
                          }
                        }}
                      />
                    </FormItem>
                    <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>体积</>} field={`volume_${container.id}`}>
                      <Input 
                        className={styles.input} 
                        placeholder="请输入" 
                        suffix="CBM"
                        type="number"
                        step="0.001"
                        min={0}
                        value={container.volume?.toString()}
                        onChange={(value) => {
                          // 限制小数点后3位
                          const numValue = Number(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            const formatted = Number(numValue.toFixed(3));
                            handleContainerChange(container.id, 'volume', formatted);
                          }
                        }}
                        onKeyPress={(e) => {
                          // 只允许输入数字和小数点
                          if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                          }
                          // 如果已经有小数点且用户又输入小数点，阻止输入
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault();
                          }
                          // 如果小数点后已有3位数字，阻止继续输入
                          const value = (e.target as HTMLInputElement).value;
                          const decimalPart = value.split('.')[1];
                          if (decimalPart && decimalPart.length >= 3 && e.key !== '.') {
                            e.preventDefault();
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            const formatted = Number(Number(value).toFixed(3));
                            handleContainerChange(container.id, 'volume', formatted);
                          }
                        }}
                      />
                    </FormItem>
                  </div>
                  <FormItem className={styles.formItem} label="危险品编号" field={`dangerousGoodsCode_${container.id}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      {container.dangerousGoodsCodes.map((code, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            style={{ width: '180px' }}
                            placeholder="请输入4位数字"
                            value={code}
                            maxLength={4}
                            onChange={(value) => {
                              // 只允许输入数字
                              const numStr = value.replace(/\D/g, '');
                              // 限制4位
                              const formatted = numStr.slice(0, 4);
                              handleDangerousCodeChange(container.id, index, formatted);
                            }}
                            onKeyPress={(e) => {
                              // 阻止非数字输入
                              if (!/\d/.test(e.key)) {
                                e.preventDefault();
                              }
                              // 如果已经有4位数字，阻止继续输入
                              const input = e.target as HTMLInputElement;
                              if (input.value.length >= 4 && input.selectionStart === input.selectionEnd) {
                                e.preventDefault();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedText = e.clipboardData.getData('text');
                              // 只保留数字
                              const numStr = pastedText.replace(/\D/g, '');
                              // 限制4位
                              const formatted = numStr.slice(0, 4);
                              handleDangerousCodeChange(container.id, index, formatted);
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              // 如果不是4位数字，清空输入
                              if (!/^\d{4}$/.test(value)) {
                                handleDangerousCodeChange(container.id, index, '');
                                Message.error('危险品编号必须是4位数字');
                              }
                            }}
                          />
                          <Button 
                            type="text" 
                            icon={<IconDelete />}
                            onClick={() => handleDeleteDangerousCode(container.id, index)}
                            className={styles.deleteIcon}
                          />
                        </div>
                      ))}
                      {container.dangerousGoodsCodes.length < 99 && (
                        <Button 
                          type="text" 
                          icon={<IconPlus />} 
                          onClick={() => handleAddDangerousCode(container.id)}
                          className={styles.addDangerousCode}
                        >
                          新增危险品编号
                        </Button>
                      )}
                    </div>
                  </FormItem>
                </Tabs.TabPane>
              ))}
            </Tabs>
          </div>
        </Card>
      </Form>

      {/* 底部按钮 */}
      <div className={styles.buttonContainer}>
        <div className={styles.buttonWrapper}>
          <Button type="secondary" onClick={handleBack}>
            返回
          </Button>
          <Button type="secondary" onClick={handleCopy}>
            复制
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

const EditPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EditPageContent />
    </Suspense>
  );
};

export default EditPage; 