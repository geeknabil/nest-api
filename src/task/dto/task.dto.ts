import { IsNotEmpty, IsString, IsOptional, IsInt, IsNumber, isDate, isNotEmpty } from 'class-validator';


export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  status: string;

}



export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
