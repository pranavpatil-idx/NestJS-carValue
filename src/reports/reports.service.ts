import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto'; 
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repo : Repository<Report>){}

    create(reportdto : CreateReportDto, user: User){
        const newReport = this.repo.create(reportdto);
        newReport.user = user;
        return this.repo.save(newReport);
    }

}
