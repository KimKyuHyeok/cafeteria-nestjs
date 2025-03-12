import { Module } from '@nestjs/common';
import { UsageHistoryService } from './usage-history.service';

@Module({
  providers: [UsageHistoryService],
})
export class UsageHistoryModule {}
