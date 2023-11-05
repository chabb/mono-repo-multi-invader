import {AfterViewInit, Component, numberAttribute, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from "./admin.service";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Config } from "@chabb/shared";
import {Subject, switchMap, tap} from "rxjs";
import {HttpClientModule} from "@angular/common/http";

export type SimpleFormGroup<Type> = {
  [Property in keyof Type]: FormControl<Type[Property]>;
};

@Component({
  selector: 'multi-invader-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  template: `

    <form [formGroup]="formGroup" *ngIf="config$ | async">
      Width : <input type="number"  formControlName="width"> <br/>
      Height :<input type="number"  formControlName="height"> <br/>
      Player life: <input type="number"  formControlName="maxLife"> <br/>
      Turrets : <input type="number"  formControlName="turrets"> <br/>
    </form>

    <button (click)="formGroup.enabled ? save() : edit()"> {{formGroup.enabled ? 'Save' : 'Edit' }} </button>
    <button (click)="reset()" *ngIf="formGroup.enabled"> Cancel </button>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigComponent implements AfterViewInit {

  private readonly formControls: SimpleFormGroup<Config> = {
    width: new FormControl<number>(0, { nonNullable: true}),
    height: new FormControl<number>(0, {nonNullable: true}),
    maxLife: new FormControl<number>(0, {nonNullable: true}),
    turrets: new FormControl<number>(0, { nonNullable: true})
  };
  protected readonly  formGroup: FormGroup<SimpleFormGroup<Config>> = new FormGroup(this.formControls);

    private readonly fetchConfig$: Subject<void> = new Subject();

    protected readonly config$ = this.fetchConfig$.pipe(
      switchMap(() => this.adminService.fetchConfig()),
      tap(({width, height, maxLife, turrets}) => {
        this.formControls.width.reset(width);
        this.formControls.height.reset(height);
        this.formControls.turrets.reset(turrets);
        this.formControls.maxLife.reset(maxLife);
        if (this.formGroup.enabled) {
          this.formGroup.disable();
        }
      })
    );


    constructor(private readonly adminService: AdminService) {}

  protected save(): void {
      this.adminService.updateConfig(this.formGroup.value).subscribe(() => this.fetchConfig$.next());
  }

  protected reset(): void {
    this.formGroup.disable();
    this.fetchConfig$.next();
  }

  protected edit(): void {
      this.formGroup.enable();
  }

  ngAfterViewInit(): void {
      this.fetchConfig$.next();
  }
}
