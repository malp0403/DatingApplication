import { NgIf } from '@angular/common';
import { Component, input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor, OnInit{

  label = input.required<string>();
  type= input<string>('text');

  constructor(@Self() public ngControl:NgControl){
    this.ngControl.valueAccessor = this;
  }

  get control():FormControl{
    return this.ngControl.control as FormControl;
  }

  ngOnInit(): void {
    // this.control.statusChanges.pipe(debounceTime(500)).subscribe({
    //   next:res=>{
    //     console.log(this.control);
    //   }
    // })
  }


  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

}
