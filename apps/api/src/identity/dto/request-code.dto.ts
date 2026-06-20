import { IsPhoneNumber } from 'class-validator';

export class RequestCodeDto {
  // 使用'CN'校验中国大陆手机号格式；未来多地区扩展时需要调整或放宽此校验
  @IsPhoneNumber('CN')
  phone!: string;
}
