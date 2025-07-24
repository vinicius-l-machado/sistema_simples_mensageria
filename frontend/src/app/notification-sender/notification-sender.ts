// src/app/notification-sender/notification-sender.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor e *ngIf
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { v4 as uuidv4 } from 'uuid'; // Para gerar UUIDs no frontend
import { NotificationService } from '../notification'; // Nosso serviço

interface MessageStatus {
  mensagemId: string;
  conteudo: string;
  status: string;
}

@Component({
  selector: 'app-notification-sender',
  standalone: true, // Componentes standalone não precisam de módulos
  imports: [CommonModule, FormsModule], // Importe CommonModule e FormsModule aqui
  templateUrl: './notification-sender.html',
  styleUrl: './notification-sender.css'
})
export class NotificationSenderComponent implements OnInit {
  conteudoMensagem: string = '';
  notifications: MessageStatus[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscreve-se às notificações do serviço para atualizar a lista
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });

    // Inicia o polling do status quando o componente é inicializado
    this.notificationService.startPollingStatus();
  }

  sendNotification(): void {
    if (!this.conteudoMensagem.trim()) {
      alert('Por favor, digite uma mensagem!');
      return;
    }

    const mensagemId = uuidv4(); // Gera um UUID único para a mensagem

    // Adiciona imediatamente a notificação à lista local com status inicial
    this.notificationService.addNotification({
      mensagemId: mensagemId,
      conteudo: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO'
    });

    // Envia para o backend
    this.notificationService.sendNotification({ mensagemId, conteudoMensagem: this.conteudoMensagem })
      .subscribe({
        next: (response) => {
          console.log('Mensagem enviada com sucesso para o backend:', response);
          // O status já foi adicionado acima, o polling ou WebSocket irá atualizá-lo.
          // Para clareza, aqui poderíamos atualizar o status inicial para o que o backend retornou
          this.notificationService.updateNotificationStatus(mensagemId, response.statusInicial);
        },
        error: (error) => {
          console.error('Erro ao enviar mensagem:', error);
          this.notificationService.updateNotificationStatus(mensagemId, 'ERRO AO ENVIAR');
        }
      });

    this.conteudoMensagem = ''; // Limpa o campo de texto
  }
  
  getCssClass(status: string): string {
    return status.toLowerCase().replace(/_/g, '-');
  }
  
  getShortenedId(id: string): string {
    return id.slice(0, 8);
  }
}