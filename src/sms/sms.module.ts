import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SmsService],
  exports: [SmsService], // Exporta el servicio para que otros módulos lo usen
})
export class SmsModule {}
