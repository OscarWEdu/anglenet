import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface AuthResponse {
	token: string;
	user: {
		id: number;
		username: string;
	};
}

interface AuthUser {
	id: number;
	username: string;
}

export interface RegisterRequest {
	username: string;
	password: string;
}

@Injectable({
  	providedIn: 'root'
})
export class AuthService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:5178/api/auth';

	private userSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
	user$ = this.userSubject.asObservable();

	register(credentials: { username: string; password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials)
			.pipe(tap(response => this.setSession(response)));
	}

	login(credentials: { username: string; password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
			.pipe(tap(response => this.setSession(response)));
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		this.userSubject.next(null);
	}
	
	private setSession(response: AuthResponse) {
		localStorage.setItem('token', response.token);
		localStorage.setItem('user', JSON.stringify(response.user));
		this.userSubject.next(response.user);
	}

	private getStoredUser(): AuthUser | null {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}

	getToken(): string | null {
		return localStorage.getItem('token');
	}

	getUser() {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}

	isLoggedIn(): boolean {
		return this.getToken() !== null;
	}
}