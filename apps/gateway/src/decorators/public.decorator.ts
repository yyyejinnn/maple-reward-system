import { IS_PUBLIC_KEY } from '@app/common/tokens/decorator.keys';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
