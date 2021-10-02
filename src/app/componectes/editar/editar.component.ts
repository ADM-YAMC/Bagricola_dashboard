
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { observable, Observable, Subscriber } from 'rxjs';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
 salir=false
 usuario;
 nombreDoctor;
 iduser;
 Abatar;
 sexo;
 TSexo;
 model: NgbDateStruct;
 eliminar=true
 CapturaImagen:any
 mostrar=false;
 Zodiaco;
 Sangre;
 Nombre:string=""
 apellido:string=""
 email:string=""
 FechaNacimeinto;
 alergias:string=""
 Cedula:string=""
 ReorganizarFecha;
 Central;
 autoComplit;
 dg;
 codigo;
 departamento
 nombreusuario;
 Msg;
 Foto = "../../../assets/picture.png"
 constructor(private router:Router,private http:HttpClient, private modalService: NgbModal) {

   $(document).ready(function(){
     $('.nav_btn').click(function(){
       $('.mobile_nav_items').toggleClass('active');
     });
   });
  }
 //node server.js
 ngOnInit(): void {
   this.NombreUser()
   let datos = JSON.parse(sessionStorage.getItem('editar'))
    this.iduser = datos.id
    this.Nombre  = datos.nombre
    this.Cedula = datos.cedula
    this.CapturaImagen = datos.foto
    this.ReorganizarFecha = datos.fecha
    this.codigo = datos.codigo
    this.departamento = datos.departamento
 }


 irHome(){
   this.router.navigate(['home'])
 }
 irARegistro(){
   this.router.navigate(['registro'])
 }

 LeerSangre(){
this.Sangre
 }

 opening(camara) {
   this.modalService.open(camara, { size: 'lg' });
 }

 irVista(){
  let data={
      id:this.iduser,
      cedula:parseInt(this.Cedula),
      nombre:this.Nombre,
      codigo:this.codigo,
      fecha:this.ReorganizarFecha,
      foto:this.CapturaImagen,
      departamento:this.departamento
  }
  sessionStorage.setItem('vista', JSON.stringify(data))
  this.router.navigate(['vista'])
}
 autoCompletar(event){
    this.http.get("https://api.adamix.net/apec/cedula/"+event.target.value+"").subscribe(data=>{
      this.autoComplit = data
      if (this.autoComplit.ok != false) {
      this.Nombre = this.autoComplit.Nombres.concat( " " +this.autoComplit.Apellido1.toString())
      this.CapturaImagen = this.autoComplit.foto
      console.log(this.autoComplit)
      }
    })
 }
 Registrar(){
   if (this.Nombre.length == 0 ||  /^\s+$/.test(this.Nombre)||this.Nombre==undefined||this.Cedula==""||this.Cedula==undefined||this.codigo==""||this.codigo==undefined || this.FechaNacimeinto.day == undefined || this.FechaNacimeinto.day == null || this.FechaNacimeinto.day== "" || this.ReorganizarFecha == "") {
     Swal.fire(
       'Vaya!',
       'No se puede hacer la actualizacion si hay campos vacios.',
       'error'
     )
   } else {
    let dia = this.FechaNacimeinto.day
    let mes = this.FechaNacimeinto.month
    let año = this.FechaNacimeinto.year
    this.ReorganizarFecha = dia +'-'+mes+'-'+año
      this.Foto =""
      this.http.post("http://127.0.0.1:8000/api/ActualizarEmpleados/"+this.Cedula.toString()+"/"+this.Nombre+"/"+this.codigo+"/"+this.ReorganizarFecha+"/"+this.departamento+"/"+this.iduser+"",{foto:this.CapturaImagen}).subscribe(data=>{
      this.Central = data
       if (this.Central.ok == true) {
        this.MensageGuardado()
       } else {
        Swal.fire(
          'Vaya!',
          'Ocurrio un error...',
          'error'
        )
       }
      });
  }

 }
 NombreUser(){
  let user = sessionStorage.getItem('name')
  this.nombreusuario = user
}
 MensageGuardado(){
   Swal.fire({
     title: 'Muy bien!',
     text: "El empleado a sido actualizado con exito!!!",
     icon: 'success',
     confirmButtonColor: '#3085d6',
     confirmButtonText: 'Aceptar'
   }).then((result) => {
     if (result.isConfirmed) {
      this.router.navigate(['home'])
     }
   })

  }

 onChange($event: Event) {
   const file = ($event.target as HTMLInputElement).files[0];
   this.convertToBase64(file);
 }

 convertToBase64(file: File) {
   const observable = new Observable((subscriber: Subscriber<any>) => {
     this.readFile(file, subscriber);
   });
   observable.subscribe(data=>{
    this.CapturaImagen = data
     console.log(this.CapturaImagen)
   })
 }

 readFile(file: File, subscriber: Subscriber<any>) {
   const filereader = new FileReader();
   filereader.readAsDataURL(file);

   filereader.onload = () => {
     subscriber.next(filereader.result);
     subscriber.complete();
   };
   filereader.onerror = (error) => {
     subscriber.error(error);
     subscriber.complete();
   };
 }

public showWebcam = true;
public allowCameraSwitch = true;
public multipleWebcamsAvailable = false;
public deviceId: string;
public videoOptions: MediaTrackConstraints = {
 // width: {ideal: 1024},
 // height: {ideal: 576}
};
public errors: WebcamInitError[] = [];

// latest snapshot
public webcamImage: WebcamImage = null;

// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();



public triggerSnapshot(): void {
 this.trigger.next();
}

public toggleWebcam(): void {
 this.mostrar=true
 this.eliminar =false
 this.showWebcam = this.showWebcam;
}

public handleInitError(error: WebcamInitError): void {
 this.errors.push(error);
}

public showNextWebcam(directionOrDeviceId: boolean|string): void {
 this.nextWebcam.next(directionOrDeviceId);
}

public handleImage(webcamImage: WebcamImage): void {
 this.webcamImage = webcamImage;
//Recuerda que esto es lo que hace el base64
 this.CapturaImagen = webcamImage.imageAsDataUrl
 console.log(webcamImage.imageAsDataUrl)
}
limpiar(){
 this.CapturaImagen=""
 this.toggleWebcam();
}
public cameraWasSwitched(deviceId: string): void {
 this.deviceId = deviceId;
}

public get triggerObservable(): Observable<void> {
 return this.trigger.asObservable();
}

public get nextWebcamObservable(): Observable<boolean|string> {
 return this.nextWebcam.asObservable();
}

}
