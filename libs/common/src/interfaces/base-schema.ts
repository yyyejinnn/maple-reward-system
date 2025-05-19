// 스키마에 직접적인 영향은 없으나, 타입 추론용
export class BaseSchema {
  _id: string;

  // { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}
