import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum VerificationType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  FORGOT_PASSWORD_VERIFICATION = 'FORGOT_PASSWORD_VERIFICATION',
}

@Entity()
export class Verification extends CoreEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('enum', {
    enum: VerificationType,
  })
  verificationType: VerificationType;
}
