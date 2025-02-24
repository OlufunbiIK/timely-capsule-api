import { 
    IsString, 
    IsUUID, 
    IsDate 
  } from 'class-validator';
  
  export class CreateGuestDto {
    @IsString()
    guestIdentifier: string;
  
    @IsDate()
    accessTime: Date;
  
    @IsString()
    action: string;
  
    @IsUUID()
    capsuleId: string;
  }
  