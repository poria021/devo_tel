// provider1.adapter.ts

import { UnifiedJobDto } from "src/DTO/UnifiedJobDto";

export class ProviderOneAdapter {
  static transform(apiResponse: any): UnifiedJobDto[] {
    const jobs = apiResponse.jobs || [];

    return jobs.map((job) => ({
      id: job.jobId,
      title: job.title,
      company: job.company?.name || "Unknown",
      location: job.details?.location || "Unknown",
      salary: job.details?.salaryRange || "N/A",
      skills: job.skills || [],
      postedDate: job.postedDate,
      source: "provider1",
    }));
  }
}
