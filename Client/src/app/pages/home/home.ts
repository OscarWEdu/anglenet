import { Component, OnInit, inject, signal } from '@angular/core';
import { TestService } from './../../services/test.service';
import { Test } from './../../models/test';

@Component({
	selector: 'app-home',
	imports: [],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit {
	private testService = inject(TestService);

	tests: Test[] = [];
	error = '';

	ngOnInit() {
		this.testService.getTests().subscribe({
		next: tests => {
			this.tests = tests;
		},
		error: error => {
			console.error('GET /api/tests failed:', error);
			this.error = 'Failed to load tests';
		}
		});
	}

	addTest() {
		console.log('Add test clicked');

		this.testService.createTest('rawr').subscribe({
		next: test => {
			console.log('Created test:', test);
			this.tests.push(test);
		},
		error: error => {
			console.error('POST /api/tests failed:', error);
			this.error = 'Failed to create test';
		}
		});
	}
}