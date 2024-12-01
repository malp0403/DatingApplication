import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { NgIf } from '@angular/common';
import { TextInputComponent } from "../forms/text-input/text-input.component";
import { DatePickerComponent } from "../forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit{

  accountService = inject(AccountService);
  registerCancel = output<boolean>();
  toastr= inject(ToastrService);
  fb = inject(FormBuilder);
  router=inject(Router);

  validationErrors:string[] | undefined;

  registerForm:FormGroup = new FormGroup({});
  maxDate=  new Date();

  ngOnInit(): void {
    this.initialForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initialForm(){
    this.registerForm = this.fb.group({
    
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(8)]],
      confirmPassword:['',[this.matchValus('password')]],
      gender:['male'],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required]

    })

    this.registerForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next:res=>{
        console.log(res);
      }
    })
  }

  matchValus(matchTo:string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control.value  == control.parent?.get(matchTo)?.value? null:{
        isMatching:true
      }
    }
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth:dob});
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.router.navigateByUrl('/members');
      },
      error:error=>{
        this.validationErrors = error;
        this.toastr.error(error.error);
        console.log(error)
      }
    })
  }

  cancel() {
    this.registerCancel.emit(false);
  }

  private getDateOnly(dob: string| undefined){
    if(!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }
}
