import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrDetailComponent } from './cr-detail.component';
import { SessionService } from '../../session/session.service';
import { users } from '../../api/fixtures';
import { ReqUser } from '../../models/cr.models';
import { CrApiService } from '../../api/cr-api.service';

const flush = () => new Promise((r) => setTimeout(r, 0));

async function render(user: ReqUser, id: string): Promise<ComponentFixture<CrDetailComponent>> {
	TestBed.configureTestingModule({
		imports: [CrDetailComponent],
		providers: [{ provide: SessionService, useValue: { user } }],
	});

	await TestBed.compileComponents();

	const fixture = TestBed.createComponent(CrDetailComponent);
	fixture.componentInstance.id = id;

	fixture.detectChanges();
	await flush();
	fixture.detectChanges();

	return fixture;
}

describe('CrDetailComponent', () => {
	it('loads and renders the change request title', async () => {
		const fixture = await render(users.approver, 'CR-1');

		expect(
			fixture.nativeElement.querySelector('.cr-detail__header h2').textContent
		).toContain('Add 1 unit of SKU-A');
	});

	it('disables Approve for a read-only viewer on a pending CR', async () => {
		const fixture = await render(users.viewer, 'CR-1');

		const approveBtn: HTMLButtonElement =
			fixture.nativeElement.querySelector('.cr-actions__approve');

		expect(approveBtn.disabled).toBe(true);
	});

	it('orders the timeline from oldest to newest', async () => {
		const fixture = await render(users.approver, 'CR-1');

		const entries =
			fixture.nativeElement.querySelectorAll('.cr-timeline__entry');

		const times = Array.from(entries).map((entry: any) =>
			entry.querySelector('.cr-timeline__at').textContent.trim()
		);

		const sorted = [...times].sort(
			(a, b) => new Date(a).getTime() - new Date(b).getTime()
		);

		expect(times).toEqual(sorted);
	});

	it('approves a pending change request', async () => {
		const fixture = await render(users.approver, 'CR-1');
		const component = fixture.componentInstance;

		await component.approve();
		fixture.detectChanges();

		expect(component.detail?.status).toBe('APPROVED');
	});

	it('requires a rejection reason', async () => {
		const fixture = await render(users.approver, 'CR-1');
		const component = fixture.componentInstance;

		await component.reject();
		fixture.detectChanges();

		expect(component.detail?.status).toBe('PENDING_APPROVAL');
		expect(component.rejectControl.touched).toBe(true);
		expect(component.rejectControl.invalid).toBe(true);
	});

	it('rejects a pending change request when a reason is provided', async () => {
		const fixture = await render(users.approver, 'CR-1');
		const component = fixture.componentInstance;

		component.rejectControl.setValue('Not acceptable');

		await component.reject();
		fixture.detectChanges();

		expect(component.detail?.status).toBe('REJECTED');
	});

	it('shows an action error when approve fails', async () => {
		const fixture = await render(users.approver, 'CR-1');
		const component = fixture.componentInstance;

		const api = TestBed.inject(CrApiService);
		api.failNext = true;

		await component.approve();
		fixture.detectChanges();

		expect(component.actionError).toBe('Network error');
	});
});