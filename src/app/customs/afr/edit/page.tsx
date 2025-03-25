"use client";

import { Card, Form, Input, Select, Space, Button, Checkbox } from '@arco-design/web-react';
import { IconPlus, IconDown, IconUp } from '@arco-design/web-react/icon';
import styles from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';

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

const EditPageContent = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [copyToNotify, setCopyToNotify] = useState(true);
  const [hblInputCount, setHblInputCount] = useState(0);
  
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

  // HBL输入框变化处理
  const handleHblInputChange = (value: string) => {
    const formatted = formatHblInput(value);
    setHblInputCount(formatted.length);
    form.setFieldValue('hblInput', formatted);
  };

  // HBL输入框粘贴处理
  const handleHblPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatHblInput(pastedText);
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    
    const currentValue = form.getFieldValue('hblInput') || '';
    const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
    const finalValue = formatHblInput(newValue);
    
    form.setFieldValue('hblInput', finalValue);
    setHblInputCount(finalValue.length);
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
                  >
                    {HBL_PREFIXES.map(prefix => (
                      <Option key={prefix} value={prefix}>
                        {prefix}
                      </Option>
                    ))}
                  </Select>
                  <Input 
                    className={`${styles.hblInput} ml-0`}
                    placeholder="请输入" 
                    onChange={handleHblInputChange}
                    onPaste={handleHblPaste}
                    maxLength={16}
                    value={form.getFieldValue('hblInput')}
                    suffix={`${hblInputCount}/16`}
                  />
                </div>
              </FormItem>
              <FormItem className={`${styles.formItem} flex-1`} label={<>船公司<span className="required-mark">*</span></>} field="carrier">
                <Select 
                  className={styles.carrierSelect} 
                  placeholder="请选择"
                  allowClear
                  showSearch
                  filterOption={(inputValue, option) => {
                    const optionValue = (option?.props as OptionProps)?.children?.toString() || '';
                    return optionValue.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                  }}
                >
                  {CARRIERS.map(carrier => (
                    <Option key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem className={`${styles.formItem} ${styles.disabled}`} label={<><span className="required-mark">*</span>MBL No.</>} field="mblNo">
                <Input className={styles.mblInput} placeholder="请输入" suffix="0/21" disabled />
              </FormItem>
              <FormItem className={styles.formItem} label={<>运输方式<span className="required-mark">*</span></>} field="transportMode">
                <Select className={styles.transportSelect} placeholder="PortToPort-港到港运输" />
              </FormItem>
              <FormItem className={styles.formItem} label={<>船名<span className="required-mark">*</span></>} field="vesselName">
                <Select className={styles.vesselSelect} placeholder="请选择" />
              </FormItem>
              <FormItem className={styles.formItem} label={<>航次<span className="required-mark">*</span></>} field="voyage">
                <Input className={styles.voyageInput} placeholder="请输入" suffix="0/5" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>收货港</>} field="loadingPort">
                <Select className={styles.portSelect} placeholder="请选择" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>卸货港</>} field="dischargePort">
                <Select className={styles.portSelect} placeholder="请选择" />
              </FormItem>
              <FormItem className={`${styles.formItem} ${styles.doubleWidth}`} label={<><span className="required-mark">*</span>目的港</>} field="destinationPort">
                <div className="flex gap-2">
                  <Input className={styles.destinationPortInput} placeholder="MOJI" />
                  <Input className={styles.destinationPortCode} placeholder="JPMOJ" />
                </div>
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>ETA</>} field="eta">
                <Input className={styles.input} placeholder="请选择" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>ETD</>} field="etd">
                <Input className={styles.input} placeholder="请选择" />
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
            <div className="space-y-6">
              {/* 发货人信息 */}
              <div>
                <div className={styles.titleField}>
                  <span>发货人信息</span>
                </div>
                <FormItem 
                  className={`${styles.formItem} ${styles.fullWidth}`} 
                  label={<><span className="required-mark">*</span>发货人抬头</>} 
                  field="shipper"
                >
                  <Input className={`flex-1 ${styles.input}`} placeholder="请输入" suffix="0/40" />
                </FormItem>
                <div className={styles.formSection}>
                  <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="shipperCountry">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>城市<span className="required-mark">*</span></>} field="shipperCity">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="shipperPhone">
                    <Input className={styles.input} placeholder="请输入" suffix="0/14" />
                  </FormItem>
                </div>
                <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="shipperAddress">
                  <Input className={styles.input} placeholder="请输入" suffix="0/100" />
                </FormItem>
              </div>

              {/* 收货人信息 */}
              <div>
                <div className={styles.titleField}>
                  <span>收货人信息</span>
                </div>
                <FormItem 
                  className={`${styles.formItem} ${styles.fullWidth}`} 
                  label={<><span className="required-mark">*</span>收货人抬头</>} 
                  field="consignee"
                >
                  <Input className={`flex-1 ${styles.input}`} placeholder="请输入" suffix="0/40" />
                </FormItem>
                <div className={styles.formSection}>
                  <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="consigneeCountry">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>城市<span className="required-mark">*</span></>} field="consigneeCity">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="consigneePhone">
                    <Input className={styles.input} placeholder="请输入" suffix="0/14" />
                  </FormItem>
                </div>
                <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="consigneeAddress">
                  <Input className={styles.input} placeholder="请输入" suffix="0/100" />
                </FormItem>
              </div>

              {/* 通知人信息 */}
              <div>
                <div className={styles.titleField}>
                  <span>通知人信息</span>
                </div>
                <FormItem 
                  className={`${styles.formItem} ${styles.fullWidth}`} 
                  label={
                    <div className={styles.notifyPartyHeader}>
                      <span className="required-mark">*</span>
                      通知人抬头
                      <Checkbox 
                        checked={copyToNotify}
                        onChange={(checked) => setCopyToNotify(checked)}
                      >
                        复制收货人
                      </Checkbox>
                    </div>
                  } 
                  field="notifyParty"
                >
                  <Input className={`flex-1 ${styles.input}`} placeholder="请输入" suffix="0/40" />
                </FormItem>
                <div className={styles.formSection}>
                  <FormItem className={styles.formItem} label={<>国家<span className="required-mark">*</span></>} field="notifyPartyCountry">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>城市<span className="required-mark">*</span></>} field="notifyPartyCity">
                    <Select className={styles.select} placeholder="请选择" />
                  </FormItem>
                  <FormItem className={styles.formItem} label={<>电话<span className="required-mark">*</span></>} field="notifyPartyPhone">
                    <Input className={styles.input} placeholder="请输入" suffix="0/14" />
                  </FormItem>
                </div>
                <FormItem className={`${styles.formItem} ${styles.fullWidth}`} label={<>地址<span className="required-mark">*</span></>} field="notifyPartyAddress">
                  <Input className={styles.input} placeholder="请输入" suffix="0/100" />
                </FormItem>
              </div>
            </div>
          </div>
        </Card>

        {/* 箱货信息 */}
        <Card className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>箱货信息</div>
            <Space>
              <Button 
                type="text" 
                className="text-[#4E5969]"
                onClick={() => toggleExpand('cargo')}
                icon={expandStatus.cargo ? <IconUp /> : <IconDown />}
              >
                {expandStatus.cargo ? '收起' : '展开'}
              </Button>
              <Button type="text" icon={<IconPlus />}>添加箱号</Button>
            </Space>
          </div>
          <div className={`${styles.formContent} ${expandStatus.cargo ? '' : styles.collapsed}`}>
            <div className={styles.formSection}>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>箱号</>} field="containerNo">
                <Input className={styles.input} placeholder="请输入" suffix="0/11" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>箱型</>} field="containerType">
                <Select className={styles.select} placeholder="请选择" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>封号</>} field="sealNo">
                <Input className={styles.input} placeholder="请输入" suffix="0/15" />
              </FormItem>
              <FormItem className={styles.formItem} label="唛头" field="mark">
                <Input className={styles.input} placeholder="请输入" suffix="0/140" />
              </FormItem>
              <FormItem className={`${styles.formItem} ${styles.doubleWidth}`} label={<><span className="required-mark">*</span>品名</>} field="goodsName">
                <Input className={styles.input} placeholder="请输入" suffix="0/180" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>件数</>} field="packageCount">
                <Input className={styles.input} placeholder="请输入" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>包装单位</>} field="packageUnit">
                <Select className={styles.select} placeholder="请选择" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>毛重</>} field="grossWeight">
                <Input className={styles.input} placeholder="请输入" suffix="KGS" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>体积</>} field="volume">
                <Input className={styles.input} placeholder="请输入" suffix="CBM" />
              </FormItem>
              <FormItem className={styles.formItem} label={<><span className="required-mark">*</span>HS Code</>} field="hsCode">
                <Input className={styles.input} placeholder="请输入" suffix="0/6" />
              </FormItem>
            </div>
            <FormItem className={`${styles.formItem} ${styles.fullWidth} mt-4`} label="危险品编号" field="dangerousGoodsCode">
              <div className="flex items-center gap-2">
                <Input className={`flex-1 ${styles.input}`} placeholder="请选择" />
                <Button type="text" icon={<IconPlus />}>新增</Button>
              </div>
            </FormItem>
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