import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
	providedIn: 'root'
})
export class TestService {
	private http = inject(HttpClient);

	private apiUrl = 'http://localhost:5178/api/tests';

	getTests(): Observable<Test[]> {
		return this.http.get<Test[]>(this.apiUrl);
	}

	createTest(gura: string): Observable<Test> {
		return this.http.post<Test>(this.apiUrl, {gura});
	}
}
