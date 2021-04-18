import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { HttpCode } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AlertGateway } from './alert.gateway';
import { SendAlertToAllDto } from './send-alert-to-all.dto';

@Controller('alert')
export class AlertController {
  constructor(private alertGateway: AlertGateway) {}

  @Post()
  @HttpCode(200)
  sendAlertToAll(@Body() { message }: SendAlertToAllDto): SendAlertToAllDto {
    this.alertGateway.sendToAll(message);
    return { message };
  }
}
