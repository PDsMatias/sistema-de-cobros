import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import * as puppeteer from 'puppeteer'; 
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: 'Puppeteer', 
      useFactory: async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        return { browser, page };
      },
    },
  ],
})
export class AppModule {}

