import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity()
export class Default {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true, default: "active" })
  status: string;
}
