import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AdministratorDTO } from "./dto/administrator.dto";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post()
    validateAdministrator(@Body() administratorDto: AdministratorDTO) {
        return this.authService.validateAdministrator(administratorDto);
    }
}