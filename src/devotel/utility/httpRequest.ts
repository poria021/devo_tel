import { HttpService } from "@nestjs/axios";
import { BadRequestException } from "@nestjs/common";
import { log } from "console";
import { catchError, lastValueFrom, map, of, timeout } from "rxjs";

export let getFromServe = async (
  url: string,
  data,
  http: HttpService,
  exTime: number
) => {
  return lastValueFrom(
    http.get(url, data).pipe(
      timeout(exTime),
      map(async (res) => {
        return res.data;
      }),
      catchError((err) => {
        throw new BadRequestException(err.message);
      })
    )
  );
};
