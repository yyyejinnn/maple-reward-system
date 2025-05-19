import mongoose, { Schema, Types } from 'mongoose';

const AUTH_URI = 'mongodb://mongo:27017/auth-db';
const EVENT_URI = 'mongodb://mongo:27017/event-db';

const now = new Date();
const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

async function seedAuthDB() {
  const conn = mongoose.createConnection(AUTH_URI);

  const userSchema = new Schema({
    email: { type: String, unique: true },
    nickname: String,
    password: String,
    role: {
      type: String,
      enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'],
    },
  });

  const User = conn.model('User', userSchema);

  const dummyUsers = [
    {
      email: 'user1@email.com',
      password: '1234',
      nickname: '유저1',
      role: 'USER',
    },
    {
      email: 'user2@email.com',
      password: '1234',
      nickname: '유저2',
      role: 'USER',
    },
    {
      email: 'operator@email.com',
      password: '1234',
      nickname: '운영자',
      role: 'OPERATOR',
    },
    {
      email: 'auditor@email.com',
      password: '1234',
      nickname: '감사자',
      role: 'AUDITOR',
    },
    {
      email: 'admin@email.com',
      password: '1234',
      nickname: '관리자',
      role: 'ADMIN',
    },
  ];

  for (const user of dummyUsers) {
    try {
      await User.updateOne({ email: user.email }, user, { upsert: true });
      console.log(`✅ 유저: ${user.email}`);
    } catch (err: any) {
      console.warn(`⚠️ 유저 생성 실패: ${user.email} - ${err.message}`);
    }
  }

  await conn.close();
}

async function seedEventDB() {
  const conn = mongoose.createConnection(EVENT_URI);

  const eventSchema = new Schema({
    title: String,
    description: String,
    isActive: Boolean,
    createdBy: String,
    period: {
      start: Date,
      end: Date,
    },
    condition: {
      type: {
        type: String,
        enum: ['LOGIN_DAYS', 'INVITE_COUNT', 'LEVEL_REACHED'],
      },
      criteria: Schema.Types.Mixed,
    },
  });

  const rewardSchema = new Schema({
    eventId: { type: Types.ObjectId, ref: 'Event' },
    type: {
      type: String,
      enum: ['POINT', 'ITEM', 'COUPON'],
    },
    name: String,
    amount: Number,
    meta: Schema.Types.Mixed,
    createdBy: String,
  });

  const Event = conn.model('Event', eventSchema);
  const Reward = conn.model('Reward', rewardSchema);

  const createdBy = 'seed-user-id';

  const existingEventCount = await Event.countDocuments();

  if (existingEventCount > 0) {
    console.log('⚠️ 이미 이벤트 데이터가 존재합니다.');
    await conn.close();
    return;
  }

  const seedData = [
    {
      event: {
        title: '출석 3일 이벤트',
        description: '3일 연속 출석 시 포인트 보상',
        isActive: true,
        createdBy,
        period: {
          start: new Date(now.getTime() - ONE_DAY),
          end: new Date(now.getTime() + ONE_DAY * 3),
        },
        condition: {
          type: 'LOGIN_DAYS',
          criteria: { days: 3 },
        },
      },
      reward: {
        type: 'POINT',
        name: '1000 포인트',
        amount: 1000,
        createdBy,
        meta: { category: 'attendance' },
      },
    },
    {
      event: {
        title: '친구 2명 초대 이벤트',
        description: '2명 이상 초대 시 아이템 지급',
        isActive: false,
        createdBy,
        period: {
          start: new Date(now.getTime() + ONE_DAY * 3),
          end: new Date(now.getTime() + ONE_DAY * 10),
        },
        condition: {
          type: 'INVITE_COUNT',
          criteria: { count: 2 },
        },
      },
      reward: {
        type: 'ITEM',
        name: '빨간포션 10개',
        amount: 10,
        createdBy,
        meta: { itemCode: 'POTION-R' },
      },
    },
    {
      event: {
        title: '10레벨 달성 이벤트',
        description: '레벨 10 달성 시 쿠폰 지급',
        isActive: true,
        createdBy,
        period: {
          start: new Date(now.getTime() - ONE_HOUR),
          end: new Date(now.getTime() + ONE_DAY * 5),
        },
        condition: {
          type: 'LEVEL_REACHED',
          criteria: { minLevel: 10 },
        },
      },
      reward: {
        type: 'COUPON',
        name: '10% 할인 쿠폰',
        amount: 1,
        createdBy,
        meta: { code: 'DISCOUNT-10' },
      },
    },
  ];

  for (const { event, reward } of seedData) {
    try {
      const createdEvent = await new Event(event).save();
      await new Reward({ ...reward, eventId: createdEvent._id }).save();
      console.log(`✅ 이벤트 생성 완료: ${event.title} + ${reward.name}`);
    } catch (err: any) {
      console.warn(`⚠️ 이벤트 생성 실패: ${err.message}`);
    }
  }

  await conn.close();
}

(async () => {
  try {
    console.log('🚀 auth-db 시드 시작');
    await seedAuthDB();
    console.log('🚀 event-db 시드 시작');
    await seedEventDB();
    console.log('🎉 전체 시드 완료');
    process.exit(0);
  } catch (err) {
    console.error('⚠️ 시드 실패:', err);
    process.exit(1);
  }
})();
