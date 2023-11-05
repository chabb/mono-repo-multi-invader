import {Component, numberAttribute, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from "./admin.service";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Config } from "@chabb/shared";
import {Subject, switchMap, tap} from "rxjs";

export type SimpleFormGroup<Type> = {
  [Property in keyof Type]: FormControl<Type[Property]>;
};

@Component({
  selector: 'multi-invader-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form formGroupName="formGroup">
      <input type="number"  formControlName="width">
      <input type="number"  formControlName="height">
      <input type="number"  formControlName="maxLife">
      <input type="number"  formControlName="turrets">
    </form>

    <button (click)="save()"> {{isEditing ? 'Save' : 'Edit' }} </button>
    <button (click)="reset()" *ngIf="isEditing"> Cancel </button>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigComponent implements OnInit {

  private readonly formControls: SimpleFormGroup<Config> = {
    width: new FormControl<number>(0, { nonNullable: true}),
    height: new FormControl<number>(0, {nonNullable: true}),
    maxLife: new FormControl<number>(0, {nonNullable: true}),
    turrets: new FormControl<number>(0, { nonNullable: true})
  };
  protected readonly  formGroup: FormGroup<SimpleFormGroup<Config>> = new FormGroup(this.formControls);

    protected isEditing = true;
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
      this.formGroup.reset();
      this.formGroup.disable();
  }

  ngOnInit(): void {
      this.fetchConfig$.next();
  }
}
