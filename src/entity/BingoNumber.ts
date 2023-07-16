import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class BingoNumber {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
