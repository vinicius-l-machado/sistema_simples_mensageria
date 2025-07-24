// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// REMOVIDO: RouterOutlet, pois seu projeto não tem roteamento por padrão
import { NotificationSenderComponent } from './notification-sender/notification-sender'; // Importe o componente

@Component({
  selector: 'app-root', // Este é o seletor da sua aplicação principal, geralmente 'app-root'
  standalone: true, // Garante que é um componente standalone
  imports: [
    CommonModule,
    NotificationSenderComponent // Adicione o componente aqui
  ],
  templateUrl: './app.html', // APONTE PARA O SEU ARQUIVO HTML
  styleUrl: './app.css' // APONTE PARA O SEU ARQUIVO CSS
})
export class AppComponent { // O nome da classe deve ser AppComponent
  title = 'frontend';
}