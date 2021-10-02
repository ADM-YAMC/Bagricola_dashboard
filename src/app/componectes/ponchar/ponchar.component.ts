
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ponchar',
  templateUrl: './ponchar.component.html',
  styleUrls: ['./ponchar.component.css']
})
export class PoncharComponent implements OnInit {

  nombreEmp: string = '';
  codigoEmp: string = '';
  fecha: string = '';
  hora: string = '';
  convert: any;
  comparar: any;
  hour: any;
  date: any;
  otra: any;
  nombre;
  turno;
  tmp: any;
  respuestas = [];
  codigoConfirm: string = '';
  name: any;
  pass: any;
  datos: any;




  constructor(private Http:HttpClient, private router:Router, private modalService: NgbModal) {

  }

  ngOnInit(): void {

  }

  obtenerNombreEmp(event) {
    this.Http.get("http://localhost:8000/api/obtenerNombreEmp/"+event.target.value+"").subscribe(data=>{
    this.comparar = data;
    this.nombre = this.comparar.Nombre
    this.turno = this.comparar.Turno
    })
  }


  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }

irLogin(){
  this.router.navigate(['login'])
}

  fechayhora() {
    var now = new Date();
    this.tmp = this.AddZero(now.getHours());
    this.hour = [
        [this.AddZero(now.getHours()),
        this.AddZero(now.getMinutes())].join(":"),
        now.getHours() >= 12 ? "PM" : "AM"].join(" ");

    this.date = [this.AddZero(now.getDate()),
      this.AddZero(now.getMonth() + 1),
      now.getFullYear()].join("-")
  }

  confirmarCodigo(password){
    this.Http.get("http://localhost:8000/api/RegistroExcusas/"+password+"").subscribe(data=>{
      this.datos = data;
      this.name = this.datos.Nombre;
      this.pass = this.datos.Clave;

    })
    if (password == this.pass) {
      this.Http.post("http://localhost:8000/api/RegistroSalidas/"+this.nombre+"/"+this.codigoEmp+"/"+this.date+""+"/"+this.hour+"",null).subscribe(data=>{
        this.convert = data;

        if (this.turno == 'Dia') {
          Swal.fire(
            'Buenas tardes!',
            "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
            'success'
          )
        } else {
          Swal.fire(
            'Buen día!',
            "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
            'success'
          )
        }
      })

      /*Swal.fire(
        'Muy bien!',
        "Fuiste despachado por el administrador: " + this.name + " .",
        'success'
      )*/
    } else {
      Swal.fire(
        'Vaya!',
        "Al parecer la contraseña del administrador es incorrecta.",
        'error'
      )

    }

  }



  entrar() {
    this.fechayhora();
    if (this.codigoEmp == '') {
      Swal.fire(
        'Vaya!',
        'No puedes dejar el campo vacío.',
        'error'
      )
    } else {
      if (this.nombre == "" || this.nombre == undefined || this.nombre == null) {
        Swal.fire(
          'Vaya!',
          'Al parecer el código como empleado no existe en la base de datos.',
          'error'
        )
      } else {
      this.Http.post("http://localhost:8000/api/RegistroEntradas/"+this.nombre+"/"+this.codigoEmp+"/"+this.date+""+"/"+this.hour+"",null).subscribe(data=>{
        this.convert = data;
      if (this.convert.ok == false) {
        Swal.fire(
          'Vaya!',
          'Al parecer ya usted ponchó en este día para ingresar a laborar, que tenga feliz día.',
          'info'
        )
      } else {
        if (this.turno == 'Dia') {
          Swal.fire(
            'Buen día!',
            "Hola, " + this.nombre + " esta fue su hora de llegada: " + this.hour + ". Usted está listo/a para trabajar, que tenga un feliz resto del día.",
            'success'
          )
        } else {
          Swal.fire(
            'Buenas tardes!',
            "Hola, " + this.nombre + " esta fue su hora de llegada: " + this.hour + ". Usted está listo/a para trabajar, que tenga un feliz resto del día.",
            'success'
          )
        }
      }

    if (this.convert.msj == "Error") {
      Swal.fire(
        'Lo sentimos!',
        'El código como empleado no existe en la base de datos.',
        'warning'
      )
    }
    })
      }
    }
  }

  salir() {
    this.fechayhora();
    console.log(this.tmp)
    if (this.codigoEmp == '') {
      Swal.fire(
        'Lo sentimos!',
        'No puedes dejar el campo vacío.',
        'warning'
      )
    } else {
      if (this.nombre == "" || this.nombre == undefined || this.nombre == null) {
        Swal.fire(
          'Lo sentimos!',
          'El código como empleado no existe en la base de datos.',
          'warning'
        )
      } else {
        if (parseInt(this.tmp) < 17) {
          Swal.fire({
            title: 'Atención!',
            text: "No puedes salir antes del horario establecido! En caso de que tengas una excusa justificada, presione 'Sí'",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí'
          }).then(async (resultado) => {
            if (resultado.isConfirmed) {
              const { value: password } = await Swal.fire({
                title: 'Enter your password',
                input: 'password',
                inputLabel: 'Password',
                inputPlaceholder: 'Enter your password',
                inputAttributes: {
                  autocapitalize: 'off',
                  autocorrect: 'off'
                }
              })

              if (password) {
                this.Http.get("http://localhost:8000/api/RegistroExcusas/"+password+"").subscribe(data=>{
                  this.datos = data;
                  this.name = this.datos.Nombre;
                  this.pass = this.datos.Clave;
                  console.log(password);
                  console.log(this.pass);

                  if (password == this.pass) {
                    this.Http.post("http://localhost:8000/api/RegistroSalidas/"+this.nombre+"/"+this.codigoEmp+"/"+this.date+"/"+this.hour+"",null).subscribe(data=>{
                      this.convert = data;

                      if (this.turno == 'Dia') {
                        Swal.fire(
                          'Buenas tardes!',
                          "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
                          'success'
                        )
                      } else {
                        Swal.fire(
                          'Buen día!',
                          "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
                          'success'
                        )
                      }
                    })

                    /*Swal.fire(
                      'Muy bien!',
                      "Fuiste despachado por el administrador: " + this.name + " .",
                      'success'
                    )*/
                  } else {
                    Swal.fire(
                      'Vaya!',
                      "Al parecer la contraseña del administrador es incorrecta.",
                      'error'
                    )

                  }

                })

              }
            }
          })

        } else {
          this.Http.post("http://localhost:8000/api/RegistroSalidas/"+this.nombre+"/"+this.codigoEmp+"/"+this.date+""+"/"+this.hour+"",null).subscribe(data=>{
        this.convert = data;
      if (this.convert.ok == false) {
        Swal.fire(
          'Vaya!',
          'Al parecer usted ya terminó su jornada laboral para hoy, no puedes ponchar nuevamente. Te esperamos mañana!',
          'warning'
        )
      } else {
        if (this.turno == 'Dia') {
          Swal.fire(
            'Buenas tardes!',
            "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
            'success'
          )
        } else {
          Swal.fire(
            'Buen día!',
            "Hola, " + this.nombre + " esta fue su hora de salida: " + this.hour + ". Usted ya terminó su jornada laboral para hoy. Te esperamos mañana!",
            'success'
          )
        }
      }

    if (this.convert.msj == "Error") {
      Swal.fire(
        'Lo sentimos!',
        'El código como empleado no existe en la base de datos.',
        'warning'
      )
    }
    if (this.convert.msj == "Er") {
      Swal.fire(
        'Lo sentimos!',
        'Usted no puede ponchar para salir de la empresa si todavia no a ponchado para entrar en la misma...',
        'warning'
      )
    }
    })
        }
      }

    }
  }

 }
