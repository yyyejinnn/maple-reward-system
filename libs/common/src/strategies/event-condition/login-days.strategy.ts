import { Injectable } from '@nestjs/common';
import { LoginDaysCriteria } from 'apps/event/interfaces/event.condition-criteria.interface';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LoginDaysStrategy implements EventConditionStrategy<LoginDaysCriteria> {
  async validate(userId: string, criteria: LoginDaysCriteria) {
    // 유저 로그인 일수 >= criteria.days
    const days = 10;
    return days >= criteria.days;
  }
}
