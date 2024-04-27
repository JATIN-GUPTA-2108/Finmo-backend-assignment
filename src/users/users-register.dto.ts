import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UsersRegisterDTO {
    @ApiProperty({ example: 'john_doe' , description: 'The username of the user'})
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    @ApiProperty({ example: 'JohnDoe#7896' , description: 'The Password of the user'})
    @IsStrongPassword()
    password: string;
}