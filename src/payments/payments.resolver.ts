import { Query, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { GqlCompanyAuthGuard } from 'src/company/gql-company-auth.guard';
import { Payments } from './model/payments.model';
import { CompanyEntity } from 'src/common/decorators/company.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class PaymentsResolver {
    constructor(private readonly paymentsService: PaymentsService) {}

    @UseGuards(GqlCompanyAuthGuard)
    @Query(() => [Payments])
    async selectPayments(@CompanyEntity() company: any): Promise<Payments[]> {
        return this.paymentsService.selectPayments(company.id);
    }
}
