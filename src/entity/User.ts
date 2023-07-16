import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    ManyToMany,
    JoinColumn,
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";

import { Role } from "./Role";;

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    lastname: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    phone: string

    @Column()
    document: string

    @ManyToOne( () => Role, role => role.users, { eager: true } )
    @JoinColumn({name:"role_id"})
    role: Role

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
