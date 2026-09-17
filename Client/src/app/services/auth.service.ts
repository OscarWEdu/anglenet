import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

	register(request: RegisterRequest): Observable<unknown> {
		return this.http.post(`${this.apiUrl}/register`, request);
	}
}
