import { MicroserviceOptions, Transport } from '@nestjs/microservices';

interface RmqUrl {
  protocol?: string;
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
  locale?: string;
  frameMax?: number;
  heartbeat?: number;
  vhost?: string;
}

export interface RmqOptions {
  transport?: Transport.RMQ;
  options?: {
    urls?: string[] | RmqUrl[];
    queue?: string;
    queueOptions?: any;
    // prefetchCount?: number;
    // isGlobalPrefetchCount?: boolean;
    // socketOptions?: any;
    // noAck?: boolean;
    // serializer?: Serializer;
    // deserializer?: Deserializer;
    // replyQueue?: string;
  };
}
export interface FlightPrice {
  id: number;
}
