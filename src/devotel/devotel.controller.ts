import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { DevotelService } from "./Services/devotel.service";
import { Pagination } from "nestjs-typeorm-paginate";
import { JobEntity } from "./Entity/Job.entity";
import { JobOfferDto } from "src/DTO/JobOfferDto";

@Controller("devotel")
export class DevotelController {
  constructor(private devService: DevotelService) {}

  //http://localhost:8000/devotel/api/job-offers?id=job-640&title=Backend Engi&location=San Francisco, TX&salaryMin=59000&salaryMax=116000
  @Get("/api/job-offers")
  gteContentFaqs(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query() query: JobOfferDto
  ): Promise<Pagination<JobEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.devService.getAllJobs(
      {
        page,
        limit,
      },
      query
    );
  }
}
