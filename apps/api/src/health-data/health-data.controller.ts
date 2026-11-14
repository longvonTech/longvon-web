import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../identity/jwt-payload.types';
import { ChannelRangeQueryDto, OsaQueryDto, SleepQueryDto } from './dto/channel-query.dto';
import { ChannelResource, LongvonChannelClient } from './longvon-channel.client';

@Controller('health-data/channel')
@UseGuards(JwtAuthGuard)
export class HealthDataController {
  constructor(private readonly channelClient: LongvonChannelClient) {}

  @Post('hr')
  getHeartRate(@CurrentUser() user: AppJwtPayload, @Body() dto: ChannelRangeQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('hr', dto);
  }

  @Post('temperature')
  getTemperature(@CurrentUser() user: AppJwtPayload, @Body() dto: ChannelRangeQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('temp', dto);
  }

  @Post('spo2')
  getSpo2(@CurrentUser() user: AppJwtPayload, @Body() dto: ChannelRangeQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('spo2', dto);
  }

  @Post('steps')
  getSteps(@CurrentUser() user: AppJwtPayload, @Body() dto: ChannelRangeQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('step', dto);
  }

  @Post('momentum')
  getMomentum(@CurrentUser() user: AppJwtPayload, @Body() dto: ChannelRangeQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('momentum', dto);
  }

  @Post('sleep')
  getSleep(@CurrentUser() user: AppJwtPayload, @Body() dto: SleepQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('sleep', dto);
  }

  @Post('osa')
  getOsa(@CurrentUser() user: AppJwtPayload, @Body() dto: OsaQueryDto) {
    this.assertAdmin(user);
    return this.channelClient.post('osa', dto);
  }

  private assertAdmin(user: AppJwtPayload): void {
    if (user.kind !== 'admin') {
      throw new ForbiddenException('健康数据渠道查询目前仅允许后台管理员访问');
    }
  }
}
