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
import { JobOfferDto } from "../DTO/JobOfferDto";
import { log } from "console";

@Controller("devotel")
export class DevotelController {
  constructor(private devService: DevotelService) {}

  //for calling this api use this url
  //http://localhost:8000/devotel/api/job-offers?title=Backend Engi&location=New York, TX&salaryMax=116000&skills=["JavaScript","Node.js"]

  // ***** Tip *****   for testing DTO and message handling
  //If you use this parm you will should get error : salaryMin=if you use this param you will should get error 59000K. or skills=["JavaScript","Node.js" .

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
