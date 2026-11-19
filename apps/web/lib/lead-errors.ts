import { ApiError } from './api-client';
import type { SiteLocale } from './i18n-routes';

export function leadSubmissionError(error: unknown, locale: SiteLocale): string {
  const status = error instanceof ApiError ? error.status : undefined;
  const zh = locale === 'zh';
  if (status === 429) return zh ? '提交过于频繁，请稍后再试，或通过邮件联系我们。' : 'Too many attempts. Please try again later or email us.';
  if (status === 400) {
    const phone = error instanceof ApiError && error.fields.includes('phone');
    return phone
      ? zh ? '请检查电话号码：使用 7–15 位数字，可带国家区号及常用分隔符。' : 'Please check your phone number: use 7–15 digits, with an optional country code and dialing separators.'
      : zh ? '提交信息未通过校验，请检查必填项和输入长度，或通过邮件联系我们。' : 'Please check the required fields and input lengths, or email us for help.';
  }
  if (status && status >= 500) return zh ? '服务暂时无法确认提交结果，请通过邮件联系我们，以免重复提交。' : 'The service could not confirm your submission. Please email us to avoid duplicate inquiries.';
  return zh ? '连接中断，无法确认提交结果。请检查网络或通过邮件联系我们，以免重复提交。' : 'Connection interrupted; submission could not be confirmed. Please check your connection or email us to avoid duplicate inquiries.';
}
