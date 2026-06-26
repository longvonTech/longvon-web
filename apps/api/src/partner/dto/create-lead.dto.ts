import { IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

// 与schema.prisma的Lead.cooperationType CHECK约束保持完全一致（TASK-104裁定的六值枚举），
// 这是唯一权威定义，QualificationForm的前端选项与本DTO都必须以此为准，不在别处重复定义
export const COOPERATION_TYPES = [
  'hospital',
  'pharmacy',
  'oem',
  'odm',
  'distributor',
  'enterprise',
] as const;
export type CooperationType = (typeof COOPERATION_TYPES)[number];

/**
 * Lead Capture统一DTO——呼应TASK-104C"统一验证规则、统一提交逻辑"：
 * 无论访客在哪个Landing Page（/partner/hospital还是/partner/oem）提交表单，
 * 后端只有一份校验规则与一个提交入口，"按cooperation_type动态切换字段"
 * 是前端QualificationForm组件的展示层逻辑（显示哪些字段、字段标签文案），
 * 不是后端为每个合作类型单独定义一套DTO/Schema——具体说明见
 * QualificationForm前端组件与partner-domain-review-v1.md的设计说明。
 */
export class CreateLeadDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @IsString()
  @MaxLength(100)
  contactName!: string;

  // 校验为中国大陆手机号格式；OEM/Distributor等B2B咨询可能来自境外企业，
  // 如未来发现这类需求量明显，需要放宽为更通用的国际号码格式校验，
  // 本Sprint先按主要目标市场(国内)的实际情况实现
  @IsPhoneNumber('CN')
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsIn(COOPERATION_TYPES)
  cooperationType!: CooperationType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remark?: string;

  // 来源追踪字段：均由前端从URL查询参数/referrer中提取后随表单一并提交，
  // 不依赖用户手动填写，也不在后端凭空生成——后端只负责"如实记录前端传来的值"
  @IsOptional() @IsString() @MaxLength(500) sourcePage?: string;
  @IsOptional() @IsString() @MaxLength(200) sourceKeyword?: string;
  @IsOptional() @IsString() @MaxLength(100) utmSource?: string;
  @IsOptional() @IsString() @MaxLength(100) utmMedium?: string;
  @IsOptional() @IsString() @MaxLength(100) utmCampaign?: string;

  // Honeypot蜜罐字段：表单里有一个对真实用户不可见(CSS隐藏)的字段，
  // 真实用户永远不会填它，简单机器人脚本往往会无差别填充表单里的全部字段，
  // 一旦这个字段非空就判定为机器人提交，呼应TASK-104G"表单防刷"要求。
  // 字段名特意不叫"honeypot"这种容易被针对性脚本识别的名字。
  @IsOptional()
  @IsString()
  website?: string;
}
