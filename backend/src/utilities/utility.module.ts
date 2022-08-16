import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';

@Module({
  exports: [UtilityService],
  providers: [UtilityService],
})
export class UtilityModule {}
