import { Component } from '@angular/core';
import { Nav } from "../../../core/components/nav/nav";
import { ImgInput } from "../../../shared/components/img-input/img-input";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { Footer } from "../../../core/components/footer/footer";
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { customUser } from '../../../shared/models/customUser';
import { UserService } from '../../../core/services/user-service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environments';
import { userPassword } from '../../../shared/models/userPassword';

@Component({
  selector: 'app-edit-user',
  imports: [Nav, ImgInput, CustomInput, Footer, CustomButton],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss',
})
export class EditUser {

  user:customUser={
    name:'',
    image:'',
    cpf:'',
    email:'',
    password:''
  }
  userPassword:userPassword={
    old_password:'',
    new_password: ''
  }
  path = '';
  
  constructor(
    private location:Location,
    private userService:UserService
  ){
    this.path = environment.apiUrl;
    this.loadUser();
  }
  onImagemSelecionada(file: File) {
    this.user.image = file;
  }
  edit(event:Event){
    event.preventDefault();
    this.userService.update(this.user).subscribe({
      next:(value)=> {
        alert('Usuário editado com sucesso');
        this.location.back();
      },error:(err)=> {
        alert(err);
      },
    })
  }
  newPassword(event:Event){
    event.preventDefault();
    this.userService.updatePassword(this.userPassword).subscribe({
      next:(value)=> {
        alert('Senha editada com sucesso');
        this.location.back();
      },error:(err)=> {
        alert(err);
      },
    })
  }
  loadUser(){
    this.userService.get_security().subscribe({
      next:(dados)=>{
        this.user=dados;
        console.log(dados);
      },error:(err)=> {
        this.location.back();
      }
    })
  }
}
