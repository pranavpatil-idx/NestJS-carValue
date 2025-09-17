import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto'; 
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repo : Repository<Report>){}

    createEstimate({make, model, lng, lat, year, mileage} : GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('ROUND(AVG(price))', 'price')
        .where('make = :make', {make})
        .andWhere('model = :model', {model})
        .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
        .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
        .andWhere('year - :year BETWEEN -10 AND 10', {year})
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)', 'ASC')
        .setParameters({mileage})
        .limit(3)
        .getRawOne();
    }

    create(reportdto : CreateReportDto, user: User){
        const newReport = this.repo.create(reportdto);
        newReport.user = user;
        return this.repo.save(newReport);
    }

    async changeApproval(id: number, approved: boolean){
        const report = await this.repo.findOne({where: {id}}); 
        if(!report){
            throw new NotFoundException('Report not found');
        }
        report.approved = approved;
        return this.repo.save(report);   
    }

    async findAll() {
        return this.repo.find();
    }

}
