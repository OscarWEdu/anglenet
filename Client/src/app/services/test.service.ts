import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TestService {
	private http = inject(HttpClient);
	private baseUrl = 'http://localhost:5178/api';

	getHello() {
		return this.http.get<{ message: string }>(`${this.baseUrl}/hello`);
	}
}