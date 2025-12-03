import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  id_token: string;
}

export interface Account {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  activated: boolean;
  authorities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<Account | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredToken();
  }

  /**
   * Carga el token almacenado y verifica la autenticación
   */
  private async loadStoredToken(): Promise<void> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    if (value) {
      this.getAccount().subscribe({
        next: (account) => {
          this.currentUserSubject.next(account);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          // Token inválido o expirado
          this.logout();
        }
      });
    }
  }

  /**
   * Realiza login y almacena el token JWT
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/api/authenticate`, credentials).pipe(
      tap(async (response) => {
        if (response.id_token) {
          await Preferences.set({
            key: this.TOKEN_KEY,
            value: response.id_token
          });
          
          // Cargar información del usuario
          this.getAccount().subscribe(account => {
            this.currentUserSubject.next(account);
            this.isAuthenticatedSubject.next(true);
          });
        }
      })
    );
  }

  /**
   * Cierra sesión y limpia el almacenamiento
   */
  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtiene el token almacenado
   */
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  /**
   * Obtiene la información de la cuenta autenticada
   */
  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.API_URL}/api/account`);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Account | null {
    return this.currentUserSubject.value;
  }
}
