import { Injectable } from '@nestjs/common';
import {
  CloudUploadOperation,
  PrepareCloudUploadDto,
} from './dto/prepare-cloud-upload.dto';

type Platform = 'android' | 'ios' | 'shared' | 'unconfirmed';

interface UpstreamEndpoint {
  platform: Platform;
  method: 'POST' | 'GET';
  path: string | null;
  purpose: string;
  evidence: 'sdk-binary-and-callsite' | 'sdk-documentation' | 'not-confirmed';
  note?: string;
}

interface UploadDefinition {
  operation: CloudUploadOperation;
  description: string;
  endpoints: UpstreamEndpoint[];
  readiness: 'mapped' | 'partial' | 'blocked';
  payloadContract: 'metadata-only-in-this-phase' | 'sdk-payload-schema-required';
}

const UPLOAD_DEFINITIONS: UploadDefinition[] = [
  {
    operation: 'heart-rate',
    description: '心率历史/手动测量记录',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/prod-api/system/dataHrRecord/manualMeasure', purpose: '心率手动测量记录', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/dataHrRecord/manualMeasure', purpose: '心率手动测量记录', evidence: 'sdk-binary-and-callsite', note: '需后端确认与 Android 路径的兼容关系' },
    ],
    readiness: 'partial',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'spo2',
    description: '血氧历史数据',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/api/system/dataSpo2Record/batchInsertNew', purpose: '血氧历史数据批量上传', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/dataSpo2Record/batchInsertNew', purpose: '血氧历史数据批量上传', evidence: 'sdk-binary-and-callsite', note: '需后端确认与 Android 路径的兼容关系' },
    ],
    readiness: 'mapped',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'temperature',
    description: '体温历史数据',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/api/system/dataCtmpRecord/batchInsertNew', purpose: '体温历史数据批量上传', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/dataCtmpRecord/batchInsertNew', purpose: '体温历史数据批量上传', evidence: 'sdk-binary-and-callsite', note: '需后端确认与 Android 路径的兼容关系' },
    ],
    readiness: 'mapped',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'steps-calories',
    description: '步数与卡路里历史数据',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/api/system/dataStepsCalorieRecord/batchInsertNew', purpose: '步数/卡路里批量上传', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/dataStepsCalorieRecord/batchInsertNew', purpose: '步数/卡路里批量上传', evidence: 'sdk-binary-and-callsite', note: '需后端确认与 Android 路径的兼容关系' },
    ],
    readiness: 'mapped',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'sleep-basic',
    description: '睡眠基础数据/体动量',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/api/system/baseDataRecord/batchInsert', purpose: '睡眠基础数据上传', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/baseDataRecord/batchInsert', purpose: '睡眠基础数据上传', evidence: 'sdk-binary-and-callsite', note: '需确认两端路径差异及 type 字段定义' },
    ],
    readiness: 'partial',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'osa-history',
    description: 'OSA 睡眠呼吸历史原始/分段数据',
    endpoints: [
      { platform: 'android', method: 'POST', path: '/api/ruoyi-system/lookeeRecord/osaDataInsert', purpose: 'OSA 历史数据上传', evidence: 'sdk-binary-and-callsite' },
      { platform: 'ios', method: 'POST', path: '/api/ruoyi-system/lookeeRecord/osaDataInsert', purpose: 'OSA 历史数据上传', evidence: 'sdk-binary-and-callsite' },
    ],
    readiness: 'partial',
    payloadContract: 'sdk-payload-schema-required',
  },
  {
    operation: 'raw-ppg',
    description: '100Hz 原始 PPG 数据',
    endpoints: [
      { platform: 'unconfirmed', method: 'POST', path: null, purpose: '原始 PPG 云端上传/算法入口', evidence: 'not-confirmed', note: 'SDK 可读取 100Hz 原始 PPG，但本次审计未确认对应云端上传 API；禁止猜测路径' },
    ],
    readiness: 'blocked',
    payloadContract: 'sdk-payload-schema-required',
  },
];

@Injectable()
export class CloudIntegrationService {
  getCatalog() {
    return {
      upstreamHost: process.env.LONGVON_CLOUD_API_BASE_URL ?? 'https://api.longvon.com',
      mode: 'metadata-only',
      outboundUploadEnabled: false,
      dataPersistenceEnabled: false,
      algorithmResultQuery: {
        status: 'not-confirmed',
        required: [
          'sleep report query (sleep stages, duration, quality)',
          'OSA report query (ODI/AHI definitions, counts, quality flags)',
          'stress/HRV report query',
          'algorithm job status / completion callback',
        ],
      },
      operations: UPLOAD_DEFINITIONS,
    };
  }

  prepareUpload(dto: PrepareCloudUploadDto) {
    const definition = UPLOAD_DEFINITIONS.find((item) => item.operation === dto.operation);
    if (!definition) {
      return { accepted: false, reason: 'unsupported-operation' as const };
    }

    const start = Date.parse(dto.startTime);
    const end = Date.parse(dto.endTime);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
      return { accepted: false, reason: 'invalid-time-range' as const };
    }

    return {
      accepted: true,
      mode: 'dry-run' as const,
      outboundRequestSent: false,
      dataPersisted: false,
      operation: dto.operation,
      sampleCount: dto.sampleCount,
      device: {
        deviceMacPresent: Boolean(dto.deviceMac),
        deviceIdPresent: Boolean(dto.deviceId),
      },
      timeRange: { startTime: dto.startTime, endTime: dto.endTime },
      endpointCandidates: definition.endpoints,
      readiness: definition.readiness,
      nextRequirement:
        definition.payloadContract === 'sdk-payload-schema-required'
          ? 'Obtain the authoritative request DTO / sample JSON from the cloud backend owner before enabling transmission.'
          : 'Confirm endpoint contract.',
    };
  }
}
