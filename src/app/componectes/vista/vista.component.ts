import { HttpClient } from '@angular/common/http';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css']
})
export class VistaComponent implements OnDestroy,  OnInit {
  iduser: any;
  Nombre: any;
  Cedula: any;
  CapturaImagen: any;
  ReorganizarFecha: any;
  codigo: any;
  departamento: any;
  nombreusuario: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  dtTrigger2 = new Subject<any>();
  fechaFinal: string;
  regEntrada: any;
  salida: any;
  veriEntrada;
  veriSalida;
  verde1;
  verde2;
  rojo1;
  rojo2;
  msj1;
  msj2;
  constructor(private router:Router,private http:HttpClient) { }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
      }
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
      }
    };
    let datos = JSON.parse(sessionStorage.getItem('vista'))
    this.iduser = datos.id
    this.Nombre  = datos.nombre
    this.Cedula = datos.cedula
    this.CapturaImagen = datos.foto
    this.ReorganizarFecha = datos.fecha
    this.codigo = datos.codigo
    this.departamento = datos.departamento
   this.NombreUser()
   this.Entradas()
   this.salidas()
   this.VerificarLLegada()
   this.VerificarSalida()
  }


  NombreUser(){
    let user = sessionStorage.getItem('name')
    this.nombreusuario = user
  }
  irARegistro(){
    this.router.navigate(['registro'])
  }
  irHome(){
    this.router.navigate(['home'])
  }

  Entradas(){
   this.http.get("http://127.0.0.1:8000/api/RegistroEntrarEmpleado/"+this.codigo+"").subscribe(data=>{
    this.regEntrada = data
    this.dtTrigger.next();
   })
  }
  SalirSistema(){
    sessionStorage.clear()
  }
  salidas(){
   this.http.get("http://127.0.0.1:8000/api/RegistroSalirEmpeado/"+this.codigo+"").subscribe(data=>{
    this.salida = data
    this.dtTrigger2.next();
   })
  }
  VerificarLLegada(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
    this.http.get("http://127.0.0.1:8000/api/CantidadEntrada/"+this.fechaFinal+"/"+this.codigo+"").subscribe(data=>{
      this.veriEntrada = data
      if (this.veriEntrada==1) {
        this.verde1 = "alert alert-success"
        this.msj1=""+this.Nombre+" ya llego, poncho y esta listo para trabajar..."
      } else {
        this.verde1 = "alert alert-danger"
        this.msj1=""+this.Nombre+" no ha llegado todavia..."
      }
     })
  }
  VerificarSalida(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
    this.http.get("http://127.0.0.1:8000/api/CantidadSalida/"+this.fechaFinal+"/"+this.codigo+"").subscribe(data=>{
      this.veriSalida = data
      if (this.veriSalida==1) {
        this.verde2 = "alert alert-success"
        this.msj2=""+this.Nombre+" ya poncho para irse a casa..."
      } else {
        this.verde2 = "alert alert-danger"
        this.msj2=""+this.Nombre+" no se ha ido todavia..."
      }
     })
  }
  irEditar(){
    let data={
        id:this.iduser,
        cedula:parseInt(this.Cedula),
        nombre:this.Nombre,
        codigo:this.codigo,
        fecha:this.ReorganizarFecha,
        foto:this.CapturaImagen,
        departamento:this.departamento
    }
   sessionStorage.setItem('editar', JSON.stringify(data))
   this.router.navigate(['editar'])
  }
}
