import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  techStack!: string; // JSON array string

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  liveDemoUrl!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  githubUrl!: string;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'integer', default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
