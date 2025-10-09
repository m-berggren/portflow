import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsInt()
	@IsNotEmpty()
	organizationId: number;
}
