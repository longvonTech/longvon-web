import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/guards/roles.guard';
import { Roles } from '../../../identity/decorators/roles.decorator';
import { PartnerService } from '../../services/partner.service';
import { ConvertLeadToPartnerDto, UpdateContractStatusDto } from '../../dto/partner-management.dto';

@Controller('admin/partners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('crm_operator', 'administrator', 'super_administrator')
export class PartnerAdminController {
  constructor(private readonly service: PartnerService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('contractStatus') contractStatus?: string) {
    return this.service.findAll({ type, contractStatus });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('from-lead/:leadId')
  convertFromLead(@Param('leadId') leadId: string, @Body() dto: ConvertLeadToPartnerDto) {
    return this.service.convertFromLead(leadId, dto);
  }

  @Patch(':id/contract-status')
  updateContractStatus(@Param('id') id: string, @Body() dto: UpdateContractStatusDto) {
    return this.service.updateContractStatus(id, dto.contractStatus);
  }
}
