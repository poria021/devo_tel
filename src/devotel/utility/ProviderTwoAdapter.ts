// provider2.adapter.ts

import { UnifiedJobDto } from "src/DTO/UnifiedJobDto";

export class ProvidertwoAdapter {
  static transform(apiResponse: any): UnifiedJobDto[] {
    const jobsList = apiResponse?.data?.jobsList || {};
    const unifiedJobs: UnifiedJobDto[] = [];

    for (const [id, jobData] of Object.entries(jobsList)) {
      const job = jobData as Provider2Job;
      const location = `${job.location?.city || "Unknown"}, ${
        job.location?.state || "Unknown"
      }`;

      // for (const [id, job] of Object.entries(jobsList)) {
      //   const location = `${job.location?.city || "Unknown"}, ${
      //     job.location?.state || "Unknown"
      //   }`;
      const salary = this.formatSalary(job.compensation);

      unifiedJobs.push({
        id,
        title: job.position,
        company: job.employer?.companyName || "Unknown",
        location,
        salary,
        skills: job.requirements?.technologies || [],
        postedDate: job.datePosted,
        source: "provider2",
      });
    }

    return unifiedJobs;
  }

  private static formatSalary(comp: any): string {
    if (!comp?.min || !comp?.max || !comp?.currency) return "N/A";
    const format = (val: number) => `$${Math.round(val / 1000)}k`;
    return `${format(comp.min)} - ${format(comp.max)}`;
  }
}
