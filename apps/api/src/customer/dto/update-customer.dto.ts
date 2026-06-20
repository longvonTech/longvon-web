import { IsOptional, IsString, MaxLength } from 'class-validator';

// Sprint 1仅开放最基础的个人资料字段编辑；
// device_id的绑定/解绑涉及设备配对流程，留待Health Data Service接入后的Sprint处理，
// 不在本DTO中开放（避免Customer模块越界处理本应属于Health Domain的关注点）
export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
