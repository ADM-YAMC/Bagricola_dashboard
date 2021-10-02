import { HttpClient } from '@angular/common/http';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as jQuery from 'jquery';
import { data } from 'jquery';
import {interval, Subject} from 'rxjs'
import Swal from 'sweetalert2'
import { EnviarDatosService } from 'src/app/servicios/enviar-datos.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  dtTrigger2 = new Subject<any>();
  dtOptions3: DataTables.Settings = {};
  dtTrigger3 = new Subject<any>();
  convercion:any
  salir=false;
  regEntrada:any
  fechaFinal;
  salida;
  cantidad;
  cantidadEn;
  cantidadSa;
  nombreusuario;
  idEmpleado;
  elimina;
  codigoEmpleado;
  constructor(private router:Router,private http:HttpClient,private servicio:EnviarDatosService) {
    $(document).ready(function(){
      $('.nav_btn').click(function(){
        $('.mobile_nav_items').toggleClass('active');
      });
    });

   }

  ngOnInit(){
    if(!navigator.onLine) {
      Swal.fire(
        'Vaya!',
        'No hay conexion a internet.',
        'error'
      )
    }
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
    this.dtOptions3 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
      }
    };
  this.http.get("http://127.0.0.1:8000/api/Registro").subscribe(data=>{
  this.convercion = data
  this.dtTrigger.next();
  sessionStorage.setItem('dat', JSON.stringify(this.convercion))
  })
  this.reload()
  this.Entradas()
  this.salidas()
  this.CantidadEmpleados()
  this.cantidadEntrada()
  this.cantidadSalida()
  this.NombreUser()
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
    this.dtTrigger3.unsubscribe();
  }

  reload(){
    this.convercion =JSON.parse(sessionStorage.getItem('dat'))
    this.regEntrada =JSON.parse(sessionStorage.getItem('entrada'))
    this.salida =JSON.parse(sessionStorage.getItem('salida'))
  }
 rel(){
   window.location.reload()
 }
 irEditar(id,cedula,nombre,codigo,fecha,foto,depa){
   let data={
       id:id,
       cedula:parseInt(cedula),
       nombre:nombre,
       codigo:codigo,
       fecha:fecha,
       foto:foto,
       departamento:depa
   }
  sessionStorage.setItem('editar', JSON.stringify(data))
  this.router.navigate(['editar'])
 }
  irARegistro(){
    this.router.navigate(['registro'])
  }
  irHome(){
    this.router.navigate(['home'])
  }
  irVista(id,cedula,nombre,codigo,fecha,foto,depa){
    let data={
      id:id,
      cedula:parseInt(cedula),
      nombre:nombre,
      codigo:codigo,
      fecha:fecha,
      foto:foto,
      departamento:depa
  }
  sessionStorage.setItem('vista', JSON.stringify(data))
    this.router.navigate(['vista'])
  }
  NombreUser(){
    let user = sessionStorage.getItem('name')
    this.nombreusuario = user
  }
  borrar(id,codigo){
  this.idEmpleado = id
  this.codigoEmpleado = codigo
  }
  EliminarEmpleado(){
    this.http.delete("http://127.0.0.1:8000/api/EliminarEmpleados/"+this.idEmpleado+"/"+this.codigoEmpleado+"").subscribe(data=>{
    this.elimina = data
    if (this.elimina.ok == true) {
      this.MensageGuardado()
    }
   })
  }
  Eliminacion(){
    Swal.fire({
      title: 'Eliminacion de Empleado',
      text: "Quieres eliminar este Empleado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
     this.EliminarEmpleado()
      }
    })
   }
   MensageGuardado(){
    Swal.fire({
      title: 'Muy bien!',
      text: "Se ha eliminado el registro con exito!",
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
       window.location.reload()
      }
    })

   }
  Entradas(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
   this.http.get("http://127.0.0.1:8000/api/RegistroEntrar/"+this.fechaFinal+"").subscribe(data=>{
    this.regEntrada = data
    this.dtTrigger2.next();
    sessionStorage.setItem('entrada', JSON.stringify(this.regEntrada))
   })
  }
  SalirSistema(){
    sessionStorage.clear()
  }
  salidas(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
   this.http.get("http://127.0.0.1:8000/api/RegistroSalir/"+this.fechaFinal+"").subscribe(data=>{
    this.salida = data
    this.dtTrigger3.next();
    sessionStorage.setItem('salida', JSON.stringify(this.salida))
   })
  }
  CantidadEmpleados(){
    this.http.get("http://127.0.0.1:8000/api/CantidadEmpleados").subscribe(data=>{
    this.cantidad = data
   })
  }
  cantidadEntrada(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
   this.http.get("http://127.0.0.1:8000/api/CantidadEmpleadosEntrada/"+this.fechaFinal+"").subscribe(data=>{
    this.cantidadEn = data
   })
  }
  cantidadSalida(){
    let fecha = new Date()
    let ff = fecha.toLocaleDateString()
    let fff = ff.toString()
    this.fechaFinal = fff.replace(/[/]/g,'-')
   this.http.get("http://127.0.0.1:8000/api/CantidadEmpleadosSalida/"+this.fechaFinal+"").subscribe(data=>{
    this.cantidadSa = data
   })
  }
}
