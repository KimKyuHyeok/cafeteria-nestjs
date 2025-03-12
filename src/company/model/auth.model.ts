import { ObjectType } from '@nestjs/graphql';
import { Token } from 'src/common/auth/model/token.model';
import { Company } from './company.model';

@ObjectType()
export class Auth extends Token {
  company: Company;
}
