import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardInvitation } from './entities/invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardInvitation])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
