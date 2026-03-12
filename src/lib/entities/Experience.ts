import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  company!: string;

  @Column({ type: 'varchar', length: 255 })
  position!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  highlights!: string; // JSON array string

  @Column({ type: 'varchar', length: 20 })
  startDate!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  endDate!: string | null;

  @Column({ type: 'boolean', default: false })
  current!: boolean;

  @Column({ type: 'integer', default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
