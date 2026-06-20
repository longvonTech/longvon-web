import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsPhoneNumber('CN')
  phone!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
