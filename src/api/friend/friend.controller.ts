import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FriendService } from './friend.service';

import { LoggedInGuard } from 'src/auth/is-logged-in.guards';

import { RequestFriendDto } from './dto/request-friend.dto';
import { AcceptFriendDto } from './dto/accept-frined.dto';

import { User } from '../../utils/request-user.decorator';
import { Users } from '../../entities/Users.entity';

@ApiTags('Friend')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '모든 친구 관계 불러오기' })
  @Get('/')
  async getAllRelations(@User() user: Users) {
    return this.friendService.getAllRelations(user.id);
  }

  @ApiOperation({ summary: '친구 요청 보내기' })
  @Post('/request')
  async sendRequest(
    @Body() requestFriendDto: RequestFriendDto,
    @User() user: Users,
  ) {
    return this.friendService.sendRequest(requestFriendDto.id, user.id);
  }

  @ApiOperation({ summary: '친구 요청 거절 및 친구 요청 취소' })
  @Delete('/request')
  async cancelRequest(
    @Query('relation') relation: string,
    @Query('id') targetId: string,
    @User() user: Users,
  ) {
    if (relation === 'follower') {
      return this.friendService.cancelRequest(targetId, user.id);
    } else if (relation === 'following') {
      return this.friendService.cancelRequest(user.id, targetId);
    }
  }

  @ApiOperation({ summary: '친구 요청 수락' })
  @Post('/accept')
  async acceptRequest(
    @Body() acceptFriendDto: AcceptFriendDto,
    @User() user: Users,
  ) {
    return this.friendService.acceptRequest(acceptFriendDto.id, user.id);
  }

  @ApiOperation({ summary: '친구 삭제' })
  @Delete('/')
  unfriend(@Query('id') targetId: string, @User() user: Users) {
    return this.friendService.unfriend(targetId, user.id);
  }
}
