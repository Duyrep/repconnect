import { ConversationType } from '@/common/enums';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator';

export class CreateConversationDto {
  @IsEnum(ConversationType)
  @IsString()
  type!: ConversationType;

  @ArrayMinSize(2)
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[A-Za-z0-9]+$/, { each: true })
  participants!: string[];
}
