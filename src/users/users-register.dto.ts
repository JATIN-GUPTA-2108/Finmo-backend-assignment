import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UsersRegisterDTO {
    @ApiProperty({ example: 'john_doe' , description: 'The username of the user'})
    @IsNotEmpty()
    username: string;

    // Validation decorator to ensure the password is not empty and meets strong password criteria
    @IsNotEmpty()
    @ApiProperty({ example: 'JohnDoe#7896' , description: 'The Password of the user'}) 
    @IsStrongPassword()
    password: string;
}