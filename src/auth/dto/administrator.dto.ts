import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdministratorDTO {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}