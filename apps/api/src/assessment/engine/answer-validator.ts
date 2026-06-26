import { BadRequestException } from '@nestjs/common';
import { Answers, QuestionnaireSchema } from './types';

/**
 * 校验提交的答案是否符合该评估的问卷定义——必填题是否都已回答、
 * 选项值是否在定义范围内、数值题是否在min/max范围内。
 * 这一步在调用计分引擎之前执行，避免脏数据进入计分逻辑产生不可解释的结果
 * （呼应"可审核/可追溯/可解释"的Sprint特别要求——计分前的输入本身必须先被验证过）。
 */
export function validateAnswers(schema: QuestionnaireSchema, answers: Answers): void {
  for (const question of schema.questions) {
    const value = answers[question.id];

    if (question.required && (value === undefined || value === null || value === '')) {
      throw new BadRequestException(`问题"${question.label}"为必填项，未提供答案`);
    }
    if (value === undefined || value === null) continue;

    switch (question.type) {
      case 'single_choice': {
        const valid = question.options?.some((o) => o.value === value);
        if (!valid) {
          throw new BadRequestException(`问题"${question.label}"的答案不在允许的选项范围内`);
        }
        break;
      }
      case 'multi_choice': {
        if (!Array.isArray(value)) {
          throw new BadRequestException(`问题"${question.label}"应为多选答案数组`);
        }
        const allowed = new Set(question.options?.map((o) => o.value) ?? []);
        const invalidValues = value.filter((v) => !allowed.has(v));
        if (invalidValues.length > 0) {
          throw new BadRequestException(
            `问题"${question.label}"包含不在允许范围内的选项：${invalidValues.join(',')}`,
          );
        }
        break;
      }
      case 'numeric': {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          throw new BadRequestException(`问题"${question.label}"应为数值答案`);
        }
        if (question.min !== undefined && value < question.min) {
          throw new BadRequestException(`问题"${question.label}"的答案不能小于${question.min}`);
        }
        if (question.max !== undefined && value > question.max) {
          throw new BadRequestException(`问题"${question.label}"的答案不能大于${question.max}`);
        }
        break;
      }
      case 'boolean': {
        if (typeof value !== 'boolean') {
          throw new BadRequestException(`问题"${question.label}"应为布尔答案`);
        }
        break;
      }
    }
  }
}
