import { validate } from 'class-validator';
import { RequestCodeDto } from './request-code.dto';
import { VerifyCodeDto } from './verify-code.dto';
import { AdminLoginDto } from './admin-login.dto';

// 本测试文件在TASK-101 Runtime Validation Sprint中补充——
// Sprint 1完成时仓库内没有任何测试文件，这本身就是当时该被记录但未被记录的一项缺口。
// 测试范围仅覆盖已有DTO的校验规则是否如预期工作，不引入任何新业务逻辑，
// 符合本Sprint"只做工程验证"的范围约束。

describe('RequestCodeDto', () => {
  it('合法手机号应通过校验', async () => {
    const dto = new RequestCodeDto();
    dto.phone = '13800138000';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('非手机号格式应校验失败', async () => {
    const dto = new RequestCodeDto();
    dto.phone = 'not-a-phone';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('VerifyCodeDto', () => {
  it('6位验证码应通过校验', async () => {
    const dto = new VerifyCodeDto();
    dto.phone = '13800138000';
    dto.code = '123456';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('验证码长度不为6位应校验失败', async () => {
    const dto = new VerifyCodeDto();
    dto.phone = '13800138000';
    dto.code = '123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('AdminLoginDto', () => {
  it('密码长度小于8位应校验失败', async () => {
    const dto = new AdminLoginDto();
    dto.username = 'admin';
    dto.password = 'short';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
