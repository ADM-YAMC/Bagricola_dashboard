import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {EnviarDatosService} from './../../servicios/enviar-datos.service'
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombre: string = '';
  correo: string = '';
  clave: string = '';
  sexo: string = '';
  convert: any;
  nombreUser;
  UserRoot="12345"
  constructor(private Http:HttpClient, private router:Router,private EnviarD:EnviarDatosService) { }

  ngOnInit(): void {
  }

  bloqueo(){
    Swal.fire({
      title: 'Atención!',
      text: "No puedes ingresar a esta seccion, pero si tiene la aprobacion del administrador principal, presione 'Sí'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí'
    }).then(async (resultado) => {
      if (resultado.isConfirmed) {
        const { value: password } = await Swal.fire({
          title: 'Pida al Administrador principal que digite su clave',
          input: 'password',
          inputPlaceholder: 'Digite la clave...',
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
          }
        })
        if (password) {
          if (this.UserRoot==password) {
         const sign_in_btn = document.querySelector("#sign-in-btn");
         const sign_up_btn = document.querySelector("#sign-up-btn");
         const container = document.querySelector(".containerm");
         sign_up_btn.addEventListener("click", () => {
           container.classList.add("sign-up-mode");
         });

         sign_in_btn.addEventListener("click", () => {
           container.classList.remove("sign-up-mode");
         });
          } else {
            Swal.fire(
              'Vaya!',
              'La clave es incorrecta.',
              'error'
            )
          }
        }
      }
    })

  }

  iniciar() {
    if (this.correo == '' || this.clave == '') {
      Swal.fire(
        'Vaya!',
        'No se puedo inicias sesion por que los campos de logueo estan vacios.',
        'error'
      )
    } else {
      this.Http.get("http://localhost:8000/api/iniciar/"+this.correo+"/"+this.clave+"").subscribe(data=>{
        this.convert = data;
        this.nombreUser = this.convert.Bienvenido
      if (this.convert.ok == false) {
        Swal.fire(
          'Vaya!',
          'Al parecer los datos ingresados son incorrectos.',
          'error'
        )
      } else {
        sessionStorage.setItem('name',this.nombreUser)
         this.EnviarD.enviar(this.convert)
        this.router.navigate(['home'])
      }
    })
    }
  }
  irPonchar(){
    this.router.navigate(['ponchar'])
  }
  registrar(){
    if (this.nombre == '' || this.correo == '' || this.clave == '') {
      Swal.fire(
        'Vaya!',
        'No puedes registrarte como administrador si no completas el formulario...',
        'error'
      )
    } else {
      if (!this.EnviarD.esEmailValido(this.correo)) {
        Swal.fire(
          'Vaya!',
          'El correo ingresado es incorrecto. Ingrese uno que si  lo sea...',
          'error'
        )
      } else {
        this.Http.post("http://localhost:8000/api/RegistroAdmin/"+this.nombre+"/"+this.correo+"/"+this.clave+"",null).subscribe(data=>{
      this.convert = data;
      if (this.convert.ok == false) {
        Swal.fire(
          'Vaya!',
          'El usuario ya existe...',
          'error'
        )
      } else {
        Swal.fire(
          'Muy bien!',
          "Se hizo el registro exitosamente!",
          'success'
        )
      }
  })
      }

    }
  }

}
