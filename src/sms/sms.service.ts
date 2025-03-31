// Codigo propio
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as twilio from 'twilio'

@Injectable()
export class SmsService {
    private accountSid;
    private authToken;
    private client;
    private twilio_number;

    constructor(private configService: ConfigService){
        this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        this.authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.client = twilio(this.accountSid, this.authToken);
    
        this.twilio_number = this.configService.get('TWILIO_PHONE_NUMBER');
    }

    async sendVerificationSms(
        phone: string,
        verificationCode: string
    ): Promise<void> {
        this.client.messages.create({
            body: `Verifica tu inicio de sesión con: ${verificationCode}`,
            from: this.twilio_number,
            to: phone
        })
    }
}