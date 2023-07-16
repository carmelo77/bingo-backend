import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany
} from "typeorm";

import { User } from "./User";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(()=> User, user=> user.role)
    users: User[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
