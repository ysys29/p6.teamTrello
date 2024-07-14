import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardInvitation } from './entities/invitation.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardInvitation, BoardMember, User])],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
