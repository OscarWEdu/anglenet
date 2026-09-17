import { Component, OnInit, inject, signal } from '@angular/core';
import { TestService } from './../../services/test.service';

@Component({
	selector: 'app-home',
	imports: [],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit {
	private testService = inject(TestService);
	protected message = signal('');

	ngOnInit() {
		this.testService.getHello().subscribe(res => this.message.set(res.message));
	}
}
