import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
} from "typeorm";


@Entity()
export class BingoCard {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    number_table: number

    @Column('json')
    values: any;

    @Column({ default: false })
    isSkip: Boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
