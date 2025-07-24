// src/app/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Adicione 'Observer' aqui, e remova 'EMPTY' se estiver presente.
import { Observable, BehaviorSubject, interval, forkJoin, Observer } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

interface NotificationPayload {
  mensagemId: string;
  conteudoMensagem: string;
}

interface NotificationResponse {
  message: string;
  mensagemId: string;
  statusInicial: string;
}

interface MessageStatus {
  mensagemId: string;
  conteudo: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private backendUrl = 'http://localhost:3000/api'; // URL do seu backend Node.js
  
  // Armazena as mensagens com seus status para exibição no componente
  private notificationsSubject = new BehaviorSubject<MessageStatus[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Adiciona uma nova notificação à lista e emite para os observadores
  addNotification(notification: MessageStatus): void {
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  // Atualiza o status de uma notificação existente na lista
  updateNotificationStatus(mensagemId: string, newStatus: string): void {
    const currentNotifications = this.notificationsSubject.getValue();
    const updatedNotifications = currentNotifications.map(n =>
      n.mensagemId === mensagemId ? { ...n, status: newStatus } : n
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  // Envia a notificação para o backend
  sendNotification(payload: NotificationPayload): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.backendUrl}/notificar`, payload);
  }

  // Método para polling do status (alternativa mais simples, como no teste)
  startPollingStatus(): void {
    interval(3000) // Polling a cada 3 segundos
      .pipe(
        startWith(0), // Executa imediatamente ao subscrever
        switchMap((): Observable<any[]> => { // Explicitamente informa que o resultado será Observable<any[]>
          const currentNotifications = this.notificationsSubject.getValue();
          const pendingMessages = currentNotifications.filter(n =>
            n.status === 'AGUARDANDO PROCESSAMENTO (Backend)' || n.status === 'AGUARDANDO PROCESSAMENTO'
          );
          
          // Para cada mensagem pendente, faz uma requisição HTTP para obter o status
          const requests = pendingMessages.map(msg => 
            this.http.get<any>(`${this.backendUrl}/notificacao/status/${msg.mensagemId}`)
          );
          
          // forkJoin aguarda todas as requisições paralelas. Se 'requests' for vazio, ele emite um array vazio e completa.
          return forkJoin(requests); 
        })
      )
      .subscribe(
        {
          next: (responses: any[]) => {
            if (responses && responses.length > 0) {
              responses.forEach(res => {
                // Adicionado verificação 'res' para evitar erro caso seja undefined/null
                if (res && this.notificationsSubject.getValue().find(n => n.mensagemId === res.mensagemId)?.status !== res.status) {
                  this.updateNotificationStatus(res.mensagemId, res.status);
                }
              });
            }
          },
          error: (err) => console.error('Erro no polling:', err)
        } as Partial<Observer<any[]>> 
      );
  }
}