import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

const CHANNEL_RESOURCES = {
  hr: '/system/v1/channel/health-data/hr-data',
  temp: '/system/v1/channel/health-data/temp-data',
  spo2: '/system/v1/channel/health-data/spo2-data',
  step: '/system/v1/channel/health-data/step-data',
  momentum: '/system/v1/channel/health-data/momentum-one-minute-data',
  sleep: '/system/v1/channel/health-data/sleep-data',
  osa: '/system/v1/channel/health-data/osa-data',
} as const;

export type ChannelResource = keyof typeof CHANNEL_RESOURCES;

@Injectable()
export class LongvonChannelClient {
  private readonly baseUrl = (
    process.env.LONGVON_CHANNEL_API_BASE_URL ?? 'https://api.longvon.com/api'
  ).replace(/\\/$/, '');

  private getHeaders() {
    const token = process.env.LONGVON_CHANNEL_TOKEN;
    const accessKey = process.env.LONGVON_CHANNEL_ACCESS_KEY;
    const accessSecret = process.env.LONGVON_CHANNEL_ACCESS_SECRET;

    if (!token || !accessKey || !accessSecret) {
      throw new ServiceUnavailableException(
        'LONGVON channel API credentials are not configured on the server',
      );
    }

    return {
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      'My-Language': process.env.LONGVON_CHANNEL_LANGUAGE ?? 'zh',
      accessKey,
      accessSecret,
      'Content-Type': 'application/json',
    };
  }

  async post<T extends Record<string, unknown>>(
    resource: ChannelResource,
    payload: T,
  ): Promise<unknown> {
    const path = CHANNEL_RESOURCES[resource];
    try {
      const response = await axios.post(`${this.baseUrl}${path}`, payload, {
        headers: this.getHeaders(),
        timeout: 20_000,
        maxBodyLength: 10 * 1024 * 1024,
        maxContentLength: 10 * 1024 * 1024,
      });

      // Preserve the upstream envelope and field types. Do not silently reinterpret
      // scores, percentages, units, status codes, or algorithm classifications.
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new GatewayTimeoutException('LONGVON channel API request timed out');
        }
        if (error.response) {
          throw new BadGatewayException({
            message: 'LONGVON channel API returned an error',
            upstreamStatus: error.response.status,
            upstreamBody: sanitizeUpstreamError(error.response.data),
          });
        }
        throw new BadGatewayException('Unable to reach LONGVON channel API');
      }
      throw error;
    }
  }
}

function sanitizeUpstreamError(value: unknown): unknown {
  if (typeof value === 'string') return value.slice(0, 1000);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return {
      code: record.code,
      msg: typeof record.msg === 'string' ? record.msg.slice(0, 500) : undefined,
    };
  }
  return undefined;
}
